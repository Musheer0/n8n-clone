"use client"

import { Button } from "@/components/ui/button"
import { useExecuteWorkflow } from "@/hooks/use-workflows"
import { FlaskRoundIcon } from "lucide-react"
import { useReactFlow } from "@xyflow/react"
import { useWorkflowContext } from "./workflow-provider"

const ExecuteWorkflowButton = () => {
  const { mutate, isPending, isError } = useExecuteWorkflow()
  const workflow = useWorkflowContext()
  const { getNodes } = useReactFlow()

  const hasManualNode = getNodes().some(
    node => node.type === "manual"
  )

  if (!hasManualNode) return null

  return (
    <Button
      disabled={isPending}
      onClick={() => mutate({ workflow_id: workflow.id })}
      className="flex items-center gap-2"
    >
      <FlaskRoundIcon className="h-4 w-4" />
      Execute Workflow
    </Button>
  )
}

export default ExecuteWorkflowButton
