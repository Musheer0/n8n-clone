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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useReactFlow } from "@xyflow/react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  geminiData,
  GEMINI_MODELS,
} from "@/executors/gemini-executor/schema"

import CredentialsSelector from "../../credentials-selector"

/* ---------------- TYPES ---------------- */

type FormValues = z.infer<typeof geminiData>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  nodeId: string
  data?: Partial<FormValues>
}

/* ---------------- COMPONENT ---------------- */

export default function GeminiSettingsDialog({
  open,
  onOpenChange,
  nodeId,
  data,
}: Props) {
  const { setNodes } = useReactFlow()

  const form = useForm<FormValues>({
    resolver: zodResolver(geminiData),
    defaultValues: {
      userprompt: data?.userprompt ?? "",
      systemprompt: data?.systemprompt ?? "",
      credentialId: data?.credentialId ?? "",
      model: data?.model ?? GEMINI_MODELS[0],
      _internal_variable_name: data?._internal_variable_name ?? "",
    },
  })

  useEffect(() => {
    if (!data) return
    form.reset({
      userprompt: data.userprompt ?? "",
      systemprompt: data.systemprompt ?? "",
      credentialId : data.credentialId ?? "",
      model: data.model ?? GEMINI_MODELS[0],
      _internal_variable_name: data._internal_variable_name ?? "",
    })
  }, [data, form])

  const onSubmit = (values: FormValues) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...values } }
          : node
      )
    )
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Gemini Settings</DialogTitle>
        </DialogHeader>
 <CredentialsSelector placeholderr="Select Api Key" type={"gemini"} value={data?.credentialId}
          onSelect={(e)=>{
            form.setValue("credentialId",e.id)
          }}
          />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Model */}
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GEMINI_MODELS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* System Prompt */}
            <FormField
              control={form.control}
              name="systemprompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* User Prompt */}
            <FormField
              control={form.control}
              name="userprompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Output Variable */}
            <FormField
              control={form.control}
              name="_internal_variable_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="result" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <p className="text-xs text-muted-foreground">
    Use previous node output like{" "}
    <code className="rounded bg-muted px-1">
     {"{{"}variablename.response{"}}"}
    </code>
  </p>
            <DialogFooter>
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
