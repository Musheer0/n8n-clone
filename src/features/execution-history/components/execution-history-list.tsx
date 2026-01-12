"use client";

import { usePaginatedExecutions } from "@/hooks/use-execution-status";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Bug,
} from "lucide-react";

/**
 * EXECUTION HISTORY UI
 * single file
 * no drama
 */
export default function ExecutionHistory() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePaginatedExecutions();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading executions...
      </div>
    );
  }

  const executions =
    data?.pages.flatMap((page) => page.executions) ?? [];

  if (!executions.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No executions yet. Calm before the storm.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {executions.map((exe) => (
        <Card key={exe.id}>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle className="text-sm font-medium truncate">
              Workflow: {exe.workflow_id}
            </CardTitle>
            <StatusBadge status={exe.status} />
          </CardHeader>

          <CardContent className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {new Date(exe.createdAt).toLocaleString()}
            </span>

            {exe.error && (
              <ErrorDialog
                error={exe.error}
                stack={exe.errorStack}
              />
            )}
          </CardContent>
        </Card>
      ))}

      {hasNextPage && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading more
            </>
          ) : (
            "Load more"
          )}
        </Button>
      )}
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function StatusBadge({
  status,
}: {
  status: "success" | "error" | "running" | null;
}) {
  switch (status) {
    case "success":
      return (
        <Badge className="bg-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Success
        </Badge>
      );
    case "error":
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Error
        </Badge>
      );
    case "running":
      return (
        <Badge variant="secondary">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Running
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

function ErrorDialog({
  error,
  stack,
}: {
  error: string;
  stack?: string | null;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <Bug className="h-4 w-4 mr-1" />
          View Error
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Execution Error</DialogTitle>
        </DialogHeader>

        {/* overflow auto so stacktrace doesn't commit UI crimes */}
        <ScrollArea className="max-h-[60vh] rounded-md border p-3">
          <pre className="text-xs whitespace-pre-wrap break-words">
            {error}
            {stack && (
              <>
                {"\n\n"}
                {stack}
              </>
            )}
          </pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
