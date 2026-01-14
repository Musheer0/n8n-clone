import z from "zod";
export const GEMINI_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
  "gemini-1.0-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite-preview-06-17",
] as const

export const geminiData = z.object({
  userprompt: z.string(),
  systemprompt: z.string(),
  credentialId: z.string(),
  model: z.enum(GEMINI_MODELS), // ✅ SINGLE VALUE
  _internal_variable_name: z.string(),
})

export type geminiDataInput  = z.infer<typeof geminiData>