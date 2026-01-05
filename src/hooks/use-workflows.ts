import { useTRPC } from "@/trpc/client"
import { useInfiniteQuery, useMutation, useQueries, useQuery, useQueryClient} from "@tanstack/react-query"
import { useReactFlow } from "@xyflow/react";
import { toast } from "sonner";

export const usePaginatedWorkflows = ()=>{
    const trpc = useTRPC()
    return useInfiniteQuery(trpc.workflow.getAll.infiniteQueryOptions({},{
        getNextPageParam:(data)=>data.cursor,
        initialCursor:null,

    }))
};
export const useWorkflow = (id:string)=>{
    const trpc = useTRPC();
     return useQuery(trpc.workflow.getOne.queryOptions({id}))
}
export const useRenameWorkflow = (id:string)=>{
    const trpc = useTRPC();
    const queryClient = useQueryClient()
    return useMutation(trpc.workflow.updateName.mutationOptions({
        onError:(data)=>{
            toast.error(data.message||"something went wrong try again...");
        },
        onSuccess:(data)=>{
            queryClient.setQueriesData({queryKey:trpc.workflow.getOne.queryKey({id})},(old)=>{
                if(!old) return old;
                return data
            });
            toast.success('updated successfully')
        }
    }))}

export const useSaveWorkflow = (workflowId:string)=>{
    const {getNodes,getEdges} = useReactFlow();
    const trpc = useTRPC();
    const {mutate,...rest} =  useMutation(trpc.nodes_edges.save.mutationOptions({}));
    return {
        ...rest,
        save:()=>{return mutate({
            workflow_id:workflowId,
            nodes:getNodes().map((node)=>({
                data:node.data||{},
                id:node.id,
                name:node?.data?.variableName as string ||node.type ||"untitled_node",
                position:node.position,
                type:node.type!,
            })),
            edges:getEdges().map((edge)=>({
                id:edge.id,
                fromNodeId:edge.source,
                toNodeId:edge.target,
                toOutput:edge.targetHandle||"main",
                fromOutput:edge.sourceHandle||"main"
             
            }))
        },{
            onError:(error)=>{
                toast.error(error.message)
            },
            onSuccess:()=>{
                toast.success('saved successfuly')
            }
        })}
    }
};
export const useWorkflowNodes = (workflowId:string)=>{
    const trpc = useTRPC();
    return useQuery(trpc.nodes_edges.getData.queryOptions({workflowId}))
};
export const useExecuteWorkflow = ()=>{
    const trpc = useTRPC();
    return useMutation(trpc.workflow.execute.start.mutationOptions({
        onSuccess:()=>toast.success("workflow started successfully"),
        onError:(data)=>toast.error(data.message)
    }))
}