import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { executeWorkflowSchema } from "./utils/execute-workflow-input";
import { getExecutor } from "@/executors/registry";
import { NodeChannel } from "./channels/node-channel";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" ,
    channels:[
      NodeChannel()
    ]
  },
  async ({ event, step,publish }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);
export const execute = inngest.createFunction(
  {id:"execute-workflow"},
  {event:"execute/workflow"},
 async ({ event, step,publish }) => {
  const {data} = event
   let  context = {};
   for (const n of data.nodes){
      const executor = getExecutor(n.type);
      const new_context = await executor({context,node:n,step,publish});
      context = new_context

   }
  },
)