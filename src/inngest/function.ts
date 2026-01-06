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
    throw new NonRetriableError('workflow id is required')
  }
  if(!data.user.id){
    throw new NonRetriableError('un authorized')
  }
  const nodes = await getNodes(data?.workflowId||data.workflow_id,data.user.id)
   let  context = data?.webhook||{};
   for (const n of nodes){
      const executor = getExecutor(n.type);
      const nodeData = n.data as any
      console.log(nodeData)
      if(n.type==="smpt_mail" && !(!nodeData?.to ||!nodeData?.from || !nodeData.subject || (!nodeData?.content ||!nodeData.html ))){
               await publish(NodeChannel().status({status:"error",nodeId:n.id}));

    throw new NonRetriableError('smpt mail not configured')

      }
      const new_context = await executor({context,node:n,step,publish,args:{
        ...nodeData,
            smtp_user:process.env.TEST_APP,
            smtp_passs:process.env.TEST_PASS
      }});
      context = new_context

   }
  },
)