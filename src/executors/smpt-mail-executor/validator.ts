import { z } from "zod"

export const sendGMailSchema = z
  .object({
    to: z.string(),
    subject: z.string().min(1),
    from: z.string().email().optional(),
    content: z.string().optional(),
    html: z.string().optional(),
    credentialId:z.string()
  })
  .refine(
    (data) => data.content || data.html,
    {
      message: "Either content or html must be provided",
      path: ["content"],
    }
  )
