import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery, } from "@tanstack/react-query";

/**
 * GET ALL EXECUTION HISTORY
 */
export const usePaginatedExecutions = ()=>{
    const trpc = useTRPC()
    return useInfiniteQuery(trpc.execution_status.getAll.infiniteQueryOptions({},{
        getNextPageParam:(data)=>data.cursor,
        initialCursor:null,

    }))
};
