"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useDeleteCredential } from "@/hooks/use-credentials-hook";
import { tCredentailsType } from "@/db/types/credentials";
import { useDeleteWorkflow } from "@/hooks/use-workflows";
import { toast } from "sonner";

type Props = {
  children: React.ReactNode;
  id: string;
};

export function DeleteWorkflowDialog({
  children,
  id,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const { mutate, isPending } = useDeleteWorkflow()

  const onDelete = () => {
    mutate(
      { id, },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError:(err)=>toast.error(err.message)
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* children = trigger */}
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600">
            Delete Workflow?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action is <b>permanent</b>.  
            The workflow will be removed from the database and cache.
            <br />
            <span className="text-red-500 font-medium">
              You cannot undo this.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
