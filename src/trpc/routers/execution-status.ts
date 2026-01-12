import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { execution_status } from "../../../drizzle/schema";
import { and, desc, eq, lt } from "drizzle-orm";
import { PAGE_SIZE } from "@/constants";
import db from "@/db";

export const executionStatusRouter = createTRPCRouter({
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
          .from(execution_status)
          .where(
            and(
              eq(execution_status.userId, userId),
              lt(execution_status.updatedAt, new Date(cursor)) // older than cursot
            )
          )
          .orderBy(desc(execution_status.updatedAt))
          .limit(PAGE_SIZE + 1)
      : await db
          .select()
          .from(execution_status)
          .where(eq(execution_status.userId, userId))
          .orderBy(desc(execution_status.updatedAt))
          .limit(PAGE_SIZE + 1);

    const nextCursor =
      data.length > PAGE_SIZE
        ? data[PAGE_SIZE].updatedAt.toISOString()
        : undefined;

    return {
      executions: data.slice(0, PAGE_SIZE), // drop extra row
      cursor: nextCursor,
    };
  }),
})