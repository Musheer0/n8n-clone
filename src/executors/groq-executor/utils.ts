import { grok, createAgent } from "@inngest/agent-kit";
import Groq from "groq-sdk";

export const getGroqResponse = async ({
  api_key,
  model,
  systemprompt,
  userprompt,
}: {
  api_key: string;
  model: string;
  systemprompt: string;
  userprompt: string;
}) => {
  const groq = new Groq({ apiKey: api_key });

  const m = grok({
    model: model as any,
    apiKey: api_key,
  });

  const output = groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: userprompt,
      },
      {role:"system", content:systemprompt}
    ],
    model: "llama-3.1-8b-instant",
  });
  
  // Extract text content from the output array
 return (await output).choices[0].message.content || 'none'
};