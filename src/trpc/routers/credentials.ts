import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import db from "@/db";
import { credentails } from "../../../drizzle/schema";
import { eq, and, lt, desc } from "drizzle-orm";
import { tCredentailsType, tcredentials } from "@/db/types/credentials";
import { redis } from "@/redis/client";
import {
  getCredentialKey,
  getCredentialsByTypeKey,
} from "@/redis/keys/credentials";
import { encrypt } from "@/lib/encrypt-decrypt";
import { PAGE_SIZE } from "@/constants";

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


getAll: protectedProcedure
  .input(
    z.object({
      cursor: z.string().optional(), // ISO string date
    })
  )
  .query(async ({ ctx, input }) => {
    const userId = ctx.auth.user.id;
    let cursor = input.cursor;

    const data = cursor
      ? await db
          .select()
          .from(credentails)
          .where(
            and(
              eq(credentails.userId, userId),
              lt(credentails.updatedAt, new Date(cursor)) // older than cursor
            )
          )
          .orderBy(desc(credentails.updatedAt))
          .limit(PAGE_SIZE + 1)
      : await db
          .select()
          .from(credentails)
          .where(eq(credentails.userId, userId))
          .orderBy(desc(credentails.updatedAt))
          .limit(PAGE_SIZE + 1);

    const nextCursor =
      data.length > PAGE_SIZE
        ? data[PAGE_SIZE].updatedAt.toISOString()
        : undefined;

    return {
      credentials: data.slice(0, PAGE_SIZE), // drop extra row
      cursor: nextCursor,
    };
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
