import { tconnection, tnode } from "@/db/types/workflow";
import toposort from 'toposort'
export const topologicalSort = (nodes:tnode[], connections:tconnection[])=>{
    if(connections.length==0) return nodes;
    const edges:[string,string][] =connections.map((c)=>[c.fromNodeId,c.toNodeId])
     const connected_nodes = new Set<string>([]);
     for (const c of connections){
        connected_nodes.add(c.fromNodeId);
        connected_nodes.add(c.toNodeId)
     }
      for (const node of nodes){
        if(!connected_nodes.has(node.id)){
            edges.push([node.id,node.id]);
        }
    }
     let sortedNodes:string[] = [];
     try {
        sortedNodes = toposort(edges);
        sortedNodes = [...new Set(sortedNodes)]
     } catch (error) {
     if(error instanceof Error && error.message.includes("Cyclic")){
            throw new Error("workflow contains a cycle");
        }
        throw error;  
    
    }
     const nodeMap = new Map(nodes.map((n)=>[n.id,n]));
     return sortedNodes.map((e)=>nodeMap.get(e)!).filter(Boolean)
}