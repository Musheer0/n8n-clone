import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { generateSlug } from "random-word-slugs";
import  db  from "@/db";
import { user, workflows } from "../../../drizzle/schema";
import { redis } from "@/redis/client";
import { getOneWorkflowKey } from "@/redis/keys/workflows";
import { checkCacheAndQuery } from "@/redis/utils/caache-exists";
import { tworkflow } from "@/db/types/workflow";
import { and, desc, eq, lt } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { PAGE_SIZE } from "@/constants";

export const workflowsRouter = createTRPCRouter({
    create:protectedProcedure.input(
        z.object({
            name:z.string().optional()
        })
    )
    .mutation(async({ctx,input})=>{
       const name = input.name|| generateSlug(3);
       const [workflow] = await db.insert(workflows).values({
        name,
        user_id:ctx.auth.user.id
       }).returning();
       await redis.set(getOneWorkflowKey(workflow.id),workflow,{ex:7*24*60*60});
       return workflow;
    }),
   remove:protectedProcedure.input(
        z.object({
            id:z.string()
        })
    )
    .mutation(async({ctx,input})=>{
        const w = await checkCacheAndQuery<tworkflow>(getOneWorkflowKey(input.id),async()=>{
           return  db.query.workflows.findFirst({
                where:and(
                    eq(user.id ,ctx.auth.user.id),
                    eq(workflows.id, input.id)
                )
            });
        });
        if(!w || w.user_id!==ctx.auth.user.id) throw new TRPCError({code:"FORBIDDEN",message:"you don't have access to this workflow"});
       await redis.del(getOneWorkflowKey(input.id));
       return w.id
    }),

    getAll:protectedProcedure
    .input(
        z.object({
            cursor:z.string().optional()
        })
    ).query(async({ctx,input})=>{
      let cursor = input.cursor
     const w = cursor ?
     await db.query.workflows.findMany({
        where:and(
            eq(workflows.user_id ,ctx.auth.user.id),
            lt(workflows.updatedAt,new Date(cursor))
        ),
        limit:10+1,
        orderBy:desc(workflows.updatedAt)
     })
     :
     await db.query.workflows.findMany({
        where:and(
            eq(workflows.user_id ,ctx.auth.user.id),
            
        ),
        limit:PAGE_SIZE+1,
        orderBy:desc(workflows.updatedAt)
     });
     cursor = w.length >PAGE_SIZE ? w[PAGE_SIZE].updatedAt.toISOString() : undefined;
     return {
        worflows:w,
        cursor
     }
    }),
    getOne:protectedProcedure
    .input(
        z.object({
            id:z.string()
        })
    )
    .query(async({ctx,input})=>{
         const w = await checkCacheAndQuery(getOneWorkflowKey(input.id),async()=>{
             return  db.query.workflows.findFirst({
                where:and(
                    eq(user.id ,ctx.auth.user.id),
                    eq(workflows.id, input.id)
                )
            });
         })
       if(!w || w.user_id!==ctx.auth.user.id) throw new TRPCError({code:"FORBIDDEN",message:"you don't have access to this workflow"});
       await redis.set(getOneWorkflowKey(w.id),w,{ex:7*24*60*60});
       return w

    }),
    updateName:protectedProcedure
    .input(
        z.object({
            id:z.string(),
            name:z.string()
        })
    )
    .mutation(async({ctx,input})=>{
          const w = await checkCacheAndQuery(getOneWorkflowKey(input.id),async()=>{
             return  db.query.workflows.findFirst({
                where:and(
                    eq(user.id ,ctx.auth.user.id),
                    eq(workflows.id, input.id)
                )
            });
         })
       if(!w || w.user_id!==ctx.auth.user.id) throw new TRPCError({code:"FORBIDDEN",message:"you don't have access to this workflow"});
       const [updated_workflow] = await db.update(workflows).set({
        name:input.name
       })
       //trusted cuz already verified access to this workflow
       .where(eq(workflows.id,input.id))
       .returning()
       await redis.set(getOneWorkflowKey(w.id),updated_workflow,{ex:7*24*60*60});
       return updated_workflow
    })

    //nodes and edges
    
})