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

export const DiscordNodeSchema = z.object({
 webhook:z.string().url(),
 content:z.string().max(2000),
})

type FormValues = z.infer<typeof DiscordNodeSchema>

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
  const form = useForm<FormValues>({
    resolver: zodResolver(DiscordNodeSchema),
    defaultValues: {
     content:data?.content||"",
     webhook:data?.webhook||""

    },
  })

  useEffect(() => {
    form.reset({
       content:data?.content||"",
     webhook:data?.webhook||""
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
          <DialogTitle>Discord  Settings</DialogTitle>
        

        </DialogHeader>
        <div>
          <Label>
            App Password
          </Label>
         
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
      

            {/* From */}
            <FormField
              control={form.control}
              name="webhook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <FormControl>
                    <Input placeholder="webhook url" {...field} />
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
