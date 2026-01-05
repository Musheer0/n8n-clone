import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { executeWorkflowSchema } from "./utils/execute-workflow-input";
import { getExecutor } from "@/executors/registry";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);
export const execute = inngest.createFunction(
  {id:"execute-workflow"},
  {event:"execute/workflow"},
 async ({ event, step }) => {
  const {data} = event
   let  context = {};
   for (const n of data.nodes){
      const executor = getExecutor(n.type);
      const new_context = await executor({context,node:n,step});
      context = new_context

   }
  },
)