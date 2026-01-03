"use client"

import React, { useState } from "react"
import { SaveIcon } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useWorkflowContext } from "./workflow-provider"
import { useRenameWorkflow } from "@/hooks/use-workflows"

const RenameWorkflow = () => {
  const workflow = useWorkflowContext()

  const [name, setName] = useState(workflow.name)
  const [isEditing, setIsEditing] = useState(false)

  const { mutate, isPending } = useRenameWorkflow(workflow.id)

  const handleSave = () => {
    if (!name.trim() || name === workflow.name) {
      setIsEditing(false)
      return
    }

    mutate(
      { id:workflow.id,name },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <p
          className="text-sm font-medium cursor-pointer hover:underline"
          onClick={() => setIsEditing(true)}
        >
          {workflow.name}
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        onBlur={()=>{
            if(!isPending) setIsEditing(false)
        }}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-8 w-48"
        autoFocus
        disabled={isPending}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave()
          if (e.key === "Escape") {
            setName(workflow.name)
            setIsEditing(false)
          }
        }}
      />

      <Button
        size="icon"
        variant="ghost"
        onClick={handleSave}
        disabled={isPending}
      >
        <SaveIcon className={isPending ? "animate-pulse" : ""} size={16} />
      </Button>
    </div>
  )
}

export default RenameWorkflow
