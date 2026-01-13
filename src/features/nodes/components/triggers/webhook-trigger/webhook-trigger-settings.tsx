"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useMemo } from "react"
import { toast } from "sonner"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
    workflowId:string
}

const BASE_WEBHOOK_URL =
  "https://x9k3bf94-3000.inc1.devtunnels.ms/api/webhooks/triggers/webhook"

export default function WebhookTriggerDialog({
  open,
  onOpenChange,
  workflowId
}: Props) {

  const webhookUrl = useMemo(() => {
    if (!workflowId) return ""
    return `${BASE_WEBHOOK_URL}?workflow=${workflowId}`
  }, [workflowId])

 
  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast.success("copied url")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl space-y-4">
        <DialogHeader>
          <DialogTitle>Webhook Trigger</DialogTitle>
        </DialogHeader>

     

        {/* Webhook URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Webhook URL</label>
          <div className="flex gap-2">
            <Input readOnly value={webhookUrl} />
            <Button
              variant="outline"
              disabled={!webhookUrl}
              onClick={() => copy(webhookUrl)}
            >
              Copy
            </Button>
          </div>
        </div>



        {/* Downstream Access */}
        <div className="space-y-2 text-sm">
          <p className="font-medium">
            Access webhook data in next nodes
          </p>

          <Textarea
            readOnly
            className="font-mono text-xs"
            value={`
webhook_trigger.data
`}
          />
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
