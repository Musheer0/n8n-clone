import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { checkCacheAndQuery } from "@/redis/utils/caache-exists";
import { getNodeEdgesKey, getOneWorkflowKey } from "@/redis/keys/workflows";
import db from "@/db";
import { and, eq, inArray, not } from "drizzle-orm";
import { connection, node, workflows } from "../../../drizzle/schema";
import { tconnection, tnode, tnode_type, tworkflow } from "@/db/types/workflow";
import { TRPCError } from "@trpc/server";
import { redis } from "@/redis/client";

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
        const inserted_nodes:tnode[] = []
        const inserted_edges:tconnection[] = []
        for (const n of input.nodes){
            const [inserted_node] = await db.insert(node).values({
                name:n.name,
                type:n.type as tnode_type ,
                data:n.data||{},
                position:n.position,
                id:n.id,
                userId: ctx.auth.user.id,
                workflow_id:input.workflow_id
            }).onConflictDoUpdate({
                target:node.id,
                set:{
                name:n.name,
                type:n.type as tnode_type ,
                data:n.data||{},
                position:n.position,            
                }
            }).returning();
            if(inserted_node) inserted_nodes.push(inserted_node)
        }
         for (const e of input.edges){
            const [inserted_edge] = await db.insert(connection).values({
                fromNodeId:e.fromNodeId,
                toNodeId:e.toNodeId,
                from_output:e.fromOutput,
                to_output:e.toOutput,
                id:e.id,
                userId: ctx.auth.user.id,
                workflow_id:input.workflow_id
            }).onConflictDoUpdate({
                target:connection.id,
                set:{
                fromNodeId:e.fromNodeId,
                toNodeId:e.toNodeId,
                from_output:e.fromOutput,
                to_output:e.toOutput,          
                }
            }).returning()
           if(inserted_edge)  inserted_edges.push(inserted_edge)
        }
       
        //cache the node results
        await redis.set(getNodeEdgesKey(w.id,w.user_id),{nodes:inserted_nodes,edges:inserted_edges},{ex:604798});
        //delete orphans
        await db.delete(node).where(not(inArray(node.id,inserted_nodes.map((e)=>e.id))));
        await db.delete(connection).where(not(inArray(connection.id,inserted_nodes.map((e)=>e.id))));
        return {
            success:true
        }
    }),
    getData:protectedProcedure.input(z.object({workflowId:z.string()}))
    .query(async({ctx,input})=>{
        const cached_data = await redis.get<{nodes:tnode[],edges:tconnection[]}>(getNodeEdgesKey(input.workflowId,ctx.auth.user.id));
        if(cached_data) return cached_data;
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
            nodes,
            edges
        }
    })
})