import { useTRPC } from "@/trpc/client"
import { useInfiniteQuery, useMutation, useQueries, useQuery, useQueryClient} from "@tanstack/react-query"
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
    }))
}