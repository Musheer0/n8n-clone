import { gemini, createAgent } from "@inngest/agent-kit";

export const getGeminiResponse = async ({
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
  const m = gemini({
    model: model as any,
    apiKey: api_key,
  });

  const agent = createAgent({
    name: "Gemini Agent",
    system: systemprompt,
    model: m,
  });

  const { output } = await agent.run(userprompt);
  
  // Extract text content from the output array
  const textResponse = output
    .filter((msg) => msg.type === "text")
    .map((msg) => msg.content)
    .join("\n");

  return textResponse;
};