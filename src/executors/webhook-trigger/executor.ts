import { NodeChannel } from "@/inngest/channels/node-channel"
import { NodeExexuteParams } from "../types"

export const WebhookExecutor = async(params:NodeExexuteParams)=>{
    await params.publish(NodeChannel().status({status:"success",nodeId:params.node.id}))
  return {
        webhook_trigger:{
            data:params.context
        }
    }
}
