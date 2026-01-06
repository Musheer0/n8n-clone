import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { executeWorkflowSchema } from "./utils/execute-workflow-input";
import { getExecutor } from "@/executors/executor-registry";
import { NodeChannel } from "./channels/node-channel";
import { getNodes } from "./utils/get-nodes";
import { TRPCError } from "@trpc/server";

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
  const {data} = event;
  if(!(data?.workflowId||data.workflow_id)){
    throw new TRPCError({code:"BAD_REQUEST", message:'workflow id is required'});
  }
  if(!data.user.id){
    throw new TRPCError({code:"UNAUTHORIZED", message:'un authorized'});
  }
  const nodes = await getNodes(data?.workflowId||data.workflow_id,data.user.id)
   let  context = data?.webhook||{};
   for (const n of nodes){
      const executor = getExecutor(n.type);
      const new_context = await executor({context,node:n,step,publish});
      context = new_context

   }
  },
)