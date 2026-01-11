import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { getExecutor } from "@/executors/executor-registry";
import { getNodes } from "./utils/get-nodes";


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

      const new_context = await executor({context,node:n,step,publish,args:{
        ...nodeData,
      }});
      context = new_context

   }
  },
)