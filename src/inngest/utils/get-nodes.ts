import db from "@/db";
import { tconnection, tnode } from "@/db/types/workflow";
import { redis } from "@/redis/client";
import { getNodeEdgesKey } from "@/redis/keys/workflows";
import { and, eq } from "drizzle-orm";
import { connection, node } from "../../../drizzle/schema";
import { topologicalSort } from "@/lib/topoogical-sort";

export const getNodes = async(workflowId:string,userId:string)=>{
     const cacheKey = getNodeEdgesKey(
        workflowId,userId
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
            eq(node.workflow_id,workflowId),
            eq(node.userId, userId)
          ),
        });

        edges = await db.query.connection.findMany({
          where: and(
            eq(connection.workflow_id, workflowId),
            eq(connection.userId, userId)
          ),
        });

        await redis.set(cacheKey, { nodes, edges });
      }
      const sorted_nodes = topologicalSort(nodes,edges);
      return sorted_nodes
}