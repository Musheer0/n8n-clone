import { useTRPC } from "@/trpc/client";
import { InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tCredentailsType, tcredentials } from "@/db/types/credentials";

/**
 * GET ALL CREDENTIALS
 */
export const usePaginatedCredentials = ()=>{
    const trpc = useTRPC()
    return useInfiniteQuery(trpc.credentials.getAll.infiniteQueryOptions({},{
        getNextPageParam:(data)=>data.cursor,
        initialCursor:null,

    }))
};
/**
 * GET ONE CREDENTIAL
 */
export const useCredential = (id: string, type: tCredentailsType) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.credentials.getOne.queryOptions({ id, type })
  );
};

/**
 * GET ALL CREDENTIALS BY TYPE
 */
export const useCredentialsByType = (type: tCredentailsType) => {
  const trpc = useTRPC();
  return useQuery(
    trpc.credentials.getAllByType.queryOptions({ type })
  );
};

/**
 * CREATE CREDENTIAL
 */
export const useCreateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        // update getAll cache
        queryClient.setQueriesData(
          { queryKey: trpc.credentials.getAll.infiniteQueryKey() },
          (old: InfiniteData<{credentials:tcredentials[]}> | undefined) => {
     if (!old) {
      return {
        pages: [{ credentials: [data] }],
        pageParams: [null],
      }
    }

    return {
      ...old,
      pages: old.pages.map((page, index) =>
        index === 0
          ? {
              ...page,
              credentials: [data, ...page.credentials],
            }
          : page
      ),
    }
          }
        );

        // update getAllByType cache
        queryClient.setQueriesData(
          {
            queryKey: trpc.credentials.getAllByType.queryKey({
              type: data.type,
            }),
          },
          (old: any[] | undefined) => (old ? [...old, data] : [data])
        );

        toast.success("Credential created");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to create credential");
      },
    })
  );
};

/**
 * DELETE CREDENTIAL
 */
export const useDeleteCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.delete.mutationOptions({
      onSuccess: (deleted) => {
        if (!deleted) return;

        // remove from getAll cache
        queryClient.setQueriesData(
          { queryKey: trpc.credentials.getAll.infiniteQueryKey() },
          (old: InfiniteData<{credentials:tcredentials[]}>| undefined) =>{
               if (!old) {
      return {
        pages: [{ credentials: [] }],
        pageParams: [null],
      }
    }

    return {
      ...old,
     pages: old.pages.map((c)=>({credentials:c.credentials.filter((e)=>e.id!==deleted.id)}))
    }
          }
        );

        // remove from getAllByType cache
        queryClient.setQueriesData(
          {
            queryKey: trpc.credentials.getAllByType.queryKey({
              type: deleted.type,
            }),
          },
          (old: any[] | undefined) =>
            old?.filter((c) => c.id !== deleted.id)
        );

        // invalidate single credential cache
        queryClient.removeQueries({
          queryKey: trpc.credentials.getOne.queryKey({
            id: deleted.id,
            type: deleted.type,
          }),
        });

        toast.success("Credential deleted");
      },
      onError: (err) => {
        toast.error(err.message || "Failed to delete credential");
      },
    })
  );
};
