import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { checkCacheAndQuery } from "@/redis/utils/caache-exists";
import {  getOneWorkflowKey } from "@/redis/keys/workflows";
import db from "@/db";
import {  eq } from "drizzle-orm";
import {  execution_status, workflows,} from "../../../drizzle/schema";
import {   tworkflow } from "@/db/types/workflow";
import { TRPCError } from "@trpc/server";
import { inngest } from "@/inngest/client";

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

     const [executionId] = await db.insert(execution_status).values({
      userId:ctx.auth.user.id,
      workflow_id:workflow.id,

     }).returning({id:execution_status.id})
      await inngest.send({
        name:"execute/workflow",
        data:{
          user:{id:ctx.auth.user.id},
          workflow_id:workflow.id,
          id:executionId
        }
      })
      return {
        success:true
      }
    }),
});
