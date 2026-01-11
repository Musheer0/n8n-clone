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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { useReactFlow } from "@xyflow/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@/components/ui/label"
import CredentialsSelector from "../../credentials-selector"

/* ---------------- ZOD SCHEMA ---------------- */

const emailNodeSchema = z.object({
  to: z.string(),
  from: z.string().email("Invalid sender email"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().optional(),
  html: z.string().optional(),
  credentialId:z.string().min(1)
})

type FormValues = z.infer<typeof emailNodeSchema>

/* ------------------------------------------- */

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  nodeId: string
  data?: Partial<FormValues>
}

export default function EmailSettingsDialog({
  open,
  onOpenChange,
  nodeId,
  data,
}: Props) {
  const { setNodes } = useReactFlow()
  const [credentialId ,setCredentialId] = useState('')
  const form = useForm<FormValues>({
    resolver: zodResolver(emailNodeSchema),
    defaultValues: {
      to: data?.to || "",
      from: data?.from || "",
      subject: data?.subject || "",
      content: data?.content || "",
      html: data?.html || "",
            credentialId:data?.credentialId||""

    },
  })

  useEffect(() => {
    form.reset({
      to: data?.to || "",
      from: data?.from || "",
      subject: data?.subject || "",
      content: data?.content || "",
      html: data?.html || "",
      credentialId:data?.credentialId||""
    })
  }, [data, form])

  const onSubmit = (values: FormValues) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                ...values,
              },
            }
          : node
      )
    )

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Email Settings</DialogTitle>
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
  🚨 Only <strong>Gmail SMTP</strong> is supported.
  <br />
  Use a Gmail account with an <strong>App Password</strong>.
  <br />
  No Outlook. No Yahoo. No custom SMTP. Don&apos;t try.
</p>

        </DialogHeader>
        <div>
          <Label>
            App Password
          </Label>
          <CredentialsSelector type={"smpt.gmail"} value={data?.credentialId}
          onSelect={(e)=>{
            form.setValue("credentialId",e.id)
          }}
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* To */}
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* From */}
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <FormControl>
                    <Input placeholder="you@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Hello 👋" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Plain Text */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (Text)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Plain text email content"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* HTML */}
            <FormField
              control={form.control}
              name="html"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HTML</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      className="font-mono text-sm"
                      placeholder={`<h1>Hello</h1>`}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    If provided, HTML is sent instead of plain text
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
