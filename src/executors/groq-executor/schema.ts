import z from "zod";
export const GROQ_MODELS = [
  "llama3-70b-8192",
  "llama3-8b-8192",
  "llama-3.1-70b-8192",
  "llama-3.1-8b-8192",
  "mixtral-8x7b-32768",
  "gemma-7b-it",
] as const

export const groqData = z.object({
  userprompt: z.string(),
  systemprompt: z.string(),
  credentialId: z.string(),
  model: z.enum(GROQ_MODELS), // ✅ SINGLE VALUE
  _internal_variable_name: z.string(),
})

export type groqDataInput  = z.infer<typeof groqData>