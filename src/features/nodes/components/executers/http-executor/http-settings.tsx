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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { httpNodeData } from "@/types/http-data"
import { useReactFlow } from "@xyflow/react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  nodeId: string
  data?: Partial<httpNodeData>
}

/* ---------------- ZOD SCHEMA (ALL HERE) ---------------- */

const httpNodeSchema = z.object({
 _internal_variable_name : z
    .string()
    .min(1, "variable name is required")
    .regex(/^[A-Za-z0-9_]+$/, {
      message: "variable name can only contain alphabets numbers and _",
    }),

  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),

  url: z
    .string()
    .min(1, "url is required"),
  body: z.string().optional(),
})

type FormValues = z.infer<typeof httpNodeSchema>

/* ------------------------------------------------------ */

export default function HttpSettingsDialog({
  open,
  onOpenChange,
  nodeId,
  data,
}: Props) {
  const { setNodes } = useReactFlow()

  const form = useForm<FormValues>({
    resolver: zodResolver(httpNodeSchema),
    defaultValues: {
      _internal_variable_name : data?._internal_variable_name || "todo",
      method: data?.method || "GET",
      url: data?.url || "",
      body:
        typeof data?.body === "string"
          ? data.body
          : JSON.stringify(data?.body ?? {}, null, 2),
    },
  })

  const method = form.watch("method")

  useEffect(() => {
    form.reset({
    _internal_variable_name : data?._internal_variable_name || "todo",
      method: data?.method || "GET",
      url: data?.url || "",
      body:
        typeof data?.body === "string"
          ? data.body
          : JSON.stringify(data?.body ?? {}, null, 2),
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
          <DialogTitle>HTTP Settings</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Variable Name */}
            <FormField
              control={form.control}
              name="_internal_variable_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="todo" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Available downstream as{" "}
                    <code>{(field.value || "todo")}.http.data</code>
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Method */}
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["GET", "POST", "PUT", "PATCH", "DELETE"].map(
                          (m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* URL */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://api.example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Body */}
            {!(method === "GET" || method === "DELETE") && (
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`{\n  "title": "hello"\n}`}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        rows={6}
                        className="font-mono text-sm"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Sent as request body
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
