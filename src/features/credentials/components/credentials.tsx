"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  AlertTriangle,
  KeyIcon,
} from "lucide-react"
import { usePaginatedCredentials } from "@/hooks/use-credentials-hook"
import { tcredentials } from "@/db/types/credentials"
import RenderCredentialIcon from "./render-credential-icon"

/* --------------------------------
   Workflow Card (pure / dumb)
--------------------------------- */

type CredentialCardProps = {
  credential:tcredentials
}

const CredentialCard = ({ credential }: CredentialCardProps) => {
  return (
<Card className="hover:shadow-md w-full max-w-sm transition">
        <CardHeader className="flex flex-row items-center gap-3">
         <RenderCredentialIcon type={credential.type} className="size-7"/>
          <div>
            <CardTitle className="text-base">
              {credential.name}
            </CardTitle>
            <CardDescription>
              Created{" "}
              {new Date(credential.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
  )
}

/* --------------------------------
   Skeleton (for initial load)
--------------------------------- */

const CredentialSkeleton = () => {
  return (
    <Card className="w-full max-w-sm animate-pulse">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="h-5 w-5 rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-3 w-24 bg-muted rounded" />
        </div>
      </CardHeader>
    </Card>
  )
}

/* --------------------------------
   Credential List (smart)
--------------------------------- */

const CredentialsList = () => {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePaginatedCredentials()

  const credentials =
    data?.pages.flatMap((page) => page.credentials) ?? []

  /* ---------- Initial Loading ---------- */
  if (isLoading) {
    return (
      <div className="p-5 flex flex-wrap gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CredentialSkeleton key={i} />
        ))}
      </div>
    )
  }

  /* ---------- Error State ---------- */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-3">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Something broke. Probably not your fault.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  /* ---------- Empty State ---------- */
  if (credentials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-2">
        <KeyIcon className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No credentials yet
        </p>
    
      </div>
    )
  }

  /* ---------- Normal State ---------- */
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-wrap gap-3">
          {credentials.map((credential) => (
            <CredentialCard key={credential.id} credential={credential} />
          ))}
        </div>

        {hasNextPage && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="gap-2"
            >
              {isFetchingNextPage && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CredentialsList
