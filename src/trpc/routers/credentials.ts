import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import db from "@/db";
import { credentails } from "../../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { tCredentailsType, tcredentials } from "@/db/types/credentials";
import { redis } from "@/redis/client";
import {
  getCredentialKey,
  getCredentialsByTypeKey,
  getCredentialsKey,
} from "@/redis/keys/credentials";
import { encrypt } from "@/lib/encrypt-decrypt";

export const credentialsRouter = createTRPCRouter({
  // CREATE (already good, just keeping for context)
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        credential: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;
      const encrypted_credential = encrypt(userId, input.credential);

      const [new_credential] = await db
        .insert(credentails)
        .values({
          ...input,
          userId,
          type: input.type as tCredentailsType,
          credential: encrypted_credential,
        })
        .returning();

      // cache single
      await redis.set(
        getCredentialKey(new_credential.id, new_credential.type),
        new_credential
      );

      // cache all
      const prevAll =
        (await redis.get<tcredentials[]>(getCredentialsKey(userId))) || [];
      await redis.set(getCredentialsKey(userId), [...prevAll, new_credential]);

      // cache by type
      const prevByType =
        (await redis.get<tcredentials[]>(
          getCredentialsByTypeKey(userId, new_credential.type)
        )) || [];
      await redis.set(
        getCredentialsByTypeKey(userId, new_credential.type),
        [...prevByType, new_credential]
      );

      return new_credential;
    }),

  // GET ONE
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;

      const cacheKey = getCredentialKey(
        input.id,
        input.type as tCredentailsType
      );
      const cached = await redis.get<tcredentials>(cacheKey);
      if (cached) return cached;

      const [credential] = await db
        .select()
        .from(credentails)
        .where(
          and(
            eq(credentails.id, input.id),
            eq(credentails.userId, userId)
          )
        );

      if (!credential) return null;

      await redis.set(cacheKey, credential);
      return credential;
    }),

  // GET ALL (NO PAGINATION)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.auth.user.id;

    const cacheKey = getCredentialsKey(userId);
    const cached = await redis.get<tcredentials[]>(cacheKey);
    if (cached) return cached;

    const credentials = await db
      .select()
      .from(credentails)
      .where(eq(credentails.userId, userId));

    await redis.set(cacheKey, credentials);
    return credentials;
  }),

  // GET ALL BY TYPE
  getAllByType: protectedProcedure
    .input(
      z.object({
        type: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;
      const type = input.type as tCredentailsType;

      const cacheKey = getCredentialsByTypeKey(userId, type);
      const cached = await redis.get<tcredentials[]>(cacheKey);
      if (cached) return cached;

      const credentials = await db
        .select()
        .from(credentails)
        .where(
          and(eq(credentails.userId, userId), eq(credentails.type, type))
        );

      await redis.set(cacheKey, credentials);
      return credentials;
    }),

  // DELETE
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;
      const type = input.type as tCredentailsType;

      const [deleted] = await db
        .delete(credentails)
        .where(
          and(
            eq(credentails.id, input.id),
            eq(credentails.userId, userId)
          )
        )
        .returning();

      if (!deleted) return null;

      // 🔥 cache cleanup (important or redis will gaslight you)

      // delete single
      await redis.del(getCredentialKey(input.id, type));

      // update all cache
      const allCache = await redis.get<tcredentials[]>(
        getCredentialsKey(userId)
      );
      if (allCache) {
        await redis.set(
          getCredentialsKey(userId),
          allCache.filter((c) => c.id !== input.id)
        );
      }

      // update type cache
      const typeCache = await redis.get<tcredentials[]>(
        getCredentialsByTypeKey(userId, type)
      );
      if (typeCache) {
        await redis.set(
          getCredentialsByTypeKey(userId, type),
          typeCache.filter((c) => c.id !== input.id)
        );
      }

      return deleted;
    }),
});
