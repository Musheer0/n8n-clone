import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { checkCacheAndQuery } from "@/redis/utils/caache-exists";
import { getNodeEdgesKey, getOneWorkflowKey } from "@/redis/keys/workflows";
import db from "@/db";
import { and, eq } from "drizzle-orm";
import { node, workflows, connection } from "../../../drizzle/schema";
import { tconnection, tnode, tworkflow } from "@/db/types/workflow";
import { TRPCError } from "@trpc/server";
import { redis } from "@/redis/client";
import { topologicalSort } from "@/lib/topoogical-sort";

export const ExecuteRouter = createTRPCRouter({
  start: protectedProcedure
    .input(
      z.object({
        workflow_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await checkCacheAndQuery<tworkflow>(
        getOneWorkflowKey(input.workflow_id),
        () => {
          return db.query.workflows.findFirst({
            where: eq(workflows.id, input.workflow_id),
          });
        }
      );

      if (!workflow) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "workflow not found",
        });
      }

      if (workflow.user_id !== ctx.auth.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "you are not authorized to access this workflow",
        });
      }

      const cacheKey = getNodeEdgesKey(
        input.workflow_id,
        ctx.auth.user.id
      );

      const cachedData = await redis.get<{
        nodes: tnode[];
        edges: tconnection[];
      }>(cacheKey);

      let nodes: tnode[] = [];
      let edges: tconnection[] = [];

      if (cachedData) {
        nodes = cachedData.nodes;
        edges = cachedData.edges;
      } else {
        nodes = await db.query.node.findMany({
          where: and(
            eq(node.workflow_id, input.workflow_id),
            eq(node.userId, ctx.auth.user.id)
          ),
        });

        edges = await db.query.connection.findMany({
          where: and(
            eq(connection.workflow_id, input.workflow_id),
            eq(connection.userId, ctx.auth.user.id)
          ),
        });

        await redis.set(cacheKey, { nodes, edges });
      }
      const sorted_nodes = topologicalSort(nodes,edges);
      // todo remove log after implementing inngest
      console.log(sorted_nodes)
      return {
        success:true
      }
    }),
});
