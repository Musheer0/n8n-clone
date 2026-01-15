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

import { useState, useMemo } from "react"
import { generateGoogleFormScript } from "@/lib/google-form-script"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
    workflowId:string
}

const BASE_WEBHOOK_URL =
  `${process.env.NEXT_PUBLIC_APP}/api/webhooks/triggers/google-form`

export default function GoogleFormTriggerDialog({
  open,
  onOpenChange,
  workflowId
}: Props) {

  const webhookUrl = useMemo(() => {
    if (!workflowId) return ""
    return `${BASE_WEBHOOK_URL}?workflow=${workflowId}`
  }, [workflowId])

  const appScript = useMemo(() => {
    if (!webhookUrl) return ""
    return generateGoogleFormScript(webhookUrl)
  }, [webhookUrl])

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl space-y-4">
        <DialogHeader>
          <DialogTitle>Google Form Trigger</DialogTitle>
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

        {/* Apps Script */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Google Apps Script
          </label>
 
          <Button
            variant="outline"
            disabled={!appScript}
            onClick={() => copy(appScript)}
          >
            Copy Apps Script
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-sm space-y-2">
          <p className="font-medium">How to connect Google Form:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Open Google Form</li>
            <li>Three dots (⋮) → Extensions → Apps Script</li>
            <li>Paste script → Save → Run once</li>
            <li>Apps Script → Triggers → Add trigger</li>
            <li>Function: onFormSubmit</li>
            <li>Event source: Form</li>
            <li>Event type: On form submit</li>
            <li>Save</li>
          </ol>
        </div>

        {/* Downstream Access */}
        <div className="space-y-2 text-sm">
          <p className="font-medium">
            Access Google Form data in next nodes
          </p>

          <Textarea
            readOnly
            className="font-mono text-xs"
            value={`// Full payload
gforms.data
// All answers
gforms.data.responses
// Single answer remove all spaces from your question
gforms.data.responsesWhatisyourname?
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
