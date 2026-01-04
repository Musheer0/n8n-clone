"use client"

import { tworkflow } from "@/db/types/workflow"
import { usePaginatedWorkflows } from "@/hooks/use-workflows"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Workflow,
  Loader2,
  AlertTriangle,
  PlusCircleIcon,
} from "lucide-react"
import Link from "next/link"
import CreateWorkflowButton from "./create-workflow-button"

/* --------------------------------
   Workflow Card (pure / dumb)
--------------------------------- */

type WorkflowCardProps = {
  workflow: tworkflow
}

const WorkflowCard = ({ workflow }: WorkflowCardProps) => {
  return (
    <Link
      href={`/workflows/${workflow.id}`}
      className="w-full max-w-sm"
    >
      <Card className="hover:shadow-md transition">
        <CardHeader className="flex flex-row items-center gap-3">
          <Workflow className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle className="text-base">
              {workflow.name}
            </CardTitle>
            <CardDescription>
              Created{" "}
              {new Date(workflow.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}

/* --------------------------------
   Skeleton (for initial load)
--------------------------------- */

const WorkflowSkeleton = () => {
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
   Workflow List (smart)
--------------------------------- */

const WorkflowList = () => {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePaginatedWorkflows()

  const workflows =
    data?.pages.flatMap((page) => page.worflows) ?? []

  /* ---------- Initial Loading ---------- */
  if (isLoading) {
    return (
      <div className="p-5 flex flex-wrap gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <WorkflowSkeleton key={i} />
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
  if (workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-2">
        <Workflow className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No workflows yet
        </p>
        <CreateWorkflowButton>
          <PlusCircleIcon/> Create one?
        </CreateWorkflowButton>
      </div>
    )
  }

  /* ---------- Normal State ---------- */
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex flex-wrap gap-3">
          {workflows.map((wf) => (
            <WorkflowCard key={wf.id} workflow={wf} />
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

export default WorkflowList
