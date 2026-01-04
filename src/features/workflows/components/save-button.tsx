"use client"

import { Button } from "@/components/ui/button"
import { useSaveWorkflow } from "@/hooks/use-workflows"
import React from "react"
import { Loader2 } from "lucide-react"

const SaveButton = ({
  children,
  id,
}: {
  children: React.ReactNode
  id: string
}) => {
  const { save, isPending } = useSaveWorkflow(id)

  return (
    <Button
      onClick={save}
      disabled={isPending}
      className="gap-2"
    >
      {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
      {isPending ? "Saving…" : children}
    </Button>
  )
}

export default SaveButton
