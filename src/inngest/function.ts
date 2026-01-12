import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { getExecutor } from "@/executors/executor-registry";
import { getNodes } from "./utils/get-nodes";
import db from "@/db";
import { execution_status } from "../../drizzle/schema";
import { eq } from "drizzle-orm";


export const execute = inngest.createFunction(
  {id:"execute-workflow",retries:0,
    onFailure:async({error,event,})=>{
     if(event.data.event.id){
       await db.update(execution_status).set({
        error:error.message,
        errorStack:error.stack,
        status:"error"
      }).where(eq(execution_status.id,event.data.event.data.id.id!))
     }
    }
  },
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
   if(event.data.id){
 console.log(event)
    await db.update(execution_status).set({
        output:context,
        status:"success"
      }).where(eq(execution_status.id,event.data.id.id))
   }
   else{
    console.log('no id')
   }
  },
)