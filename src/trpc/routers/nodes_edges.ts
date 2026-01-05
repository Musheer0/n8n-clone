import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { checkCacheAndQuery } from "@/redis/utils/caache-exists";
import { getNodeEdgesKey, getOneWorkflowKey } from "@/redis/keys/workflows";
import db from "@/db";
import { and, eq, inArray, not, sql } from "drizzle-orm";
import { connection, node, workflows } from "../../../drizzle/schema";
import { tconnection, tnode, tnode_type, tworkflow } from "@/db/types/workflow";
import { TRPCError } from "@trpc/server";
import { redis } from "@/redis/client";
import { formatEdges, formatNodes } from "../utils/format-data";

export const nodes_edges_router = createTRPCRouter({
    save:protectedProcedure
    .input(z.object({
        nodes:z.array(z.object({
                 type:z.string(),
                 data:z.record(z.string(),z.any()),
                 position:z.object({x:z.number(),y:z.number()}),
                 id:z.string(),
                 name:z.string()
        })),
        edges:z.array(z.object({
                 id:z.string(),
                 fromNodeId:z.string(),
                 toNodeId:z.string(),
                 fromOutput:z.string(),
                 toOutput:z.string(),
        })),
        workflow_id:z.string()
    }))
    .mutation(async({ctx,input})=>{
        const w = await checkCacheAndQuery<tworkflow>(getOneWorkflowKey(input.workflow_id),()=>{
            return db.query.workflows.findFirst({
                where:and(
                    eq(workflows.id,input.workflow_id),
                    eq(workflows.user_id,ctx.auth.user.id)
                )
            })
        });
        if(!w) throw new TRPCError({code:"NOT_FOUND", message:"workflow does not exits"});
        if(w.user_id!==ctx.auth.user.id) throw new TRPCError({code:"UNAUTHORIZED",message:"your not authorized to edit this workflow"});
        await db.transaction(async(tx)=>{
               const inserted_nodes = await tx.insert(node).values(
        input.nodes.map(n => ({
            name: n.name,
            type: n.type as tnode_type,
            data: n.data || {},
            position: n.position,
            userId: ctx.auth.user.id,
            workflow_id: input.workflow_id,
            id:n.id
        }))
    ).onConflictDoUpdate({
        target: node.id,
        set: {
            name: sql`excluded.name`,
            type: sql`excluded.type`,
            data: sql`excluded.data`,
            position: sql`excluded.position`,
            updatedAt: sql`now()` 
        }
    }).returning();
 const inserted_edges = await tx.insert(connection).values(
        input.edges.map(e => ({
            fromNodeId: e.fromNodeId,
            toNodeId: e.toNodeId,
            from_output: e.fromOutput,
            to_output: e.toOutput,
            userId: ctx.auth.user.id,
            workflow_id: input.workflow_id,
            id:e.id
        }))
    ).onConflictDoUpdate({
        target: connection.id,
        set: {
            fromNodeId: sql`excluded."from_node_id"`,
            toNodeId: sql`excluded."to_node_id"`,
            from_output: sql`excluded.from_output`,
            to_output: sql`excluded.to_output`,
            updatedAt: sql`now()` 
        }
    }).returning();
     
       
        //cache the node results
        await redis.set(getNodeEdgesKey(w.id,w.user_id),{nodes:inserted_nodes,edges:inserted_edges},{ex:604798});
        //delete orphans
    await tx.delete(node).where(
       and(
           eq(node.workflow_id, input.workflow_id),
           eq(node.userId, ctx.auth.user.id),
           not(inArray(node.id, inserted_nodes.map((e)=>e.id)))
       )
   );
   await tx.delete(connection).where(
       and(
           eq(connection.workflow_id, input.workflow_id),
           eq(connection.userId, ctx.auth.user.id),
           not(inArray(connection.id, inserted_edges.map((e)=>e.id)))
       )
   );
        })
         return {
            success:true
        }
    }),
    getData:protectedProcedure.input(z.object({workflowId:z.string()}))
    .query(async({ctx,input})=>{
        const cached_data = await redis.get<{nodes:tnode[],edges:tconnection[]}>(getNodeEdgesKey(input.workflowId,ctx.auth.user.id));
        if(cached_data) return {
            nodes:formatNodes(cached_data.nodes),
            edges:formatEdges(cached_data.edges)
        }
        const nodes = await db.query.node.findMany({
            where:and(
                eq(node.workflow_id, input.workflowId),
                eq(node.userId,ctx.auth.user.id)
            )
        });
          const edges = await db.query.connection.findMany({
            where:and(
                eq(connection.workflow_id, input.workflowId),
                eq(connection.userId,ctx.auth.user.id)
            )
        });
        return {
            nodes:formatNodes(nodes),
            edges:formatEdges(edges)
        }
    })
})