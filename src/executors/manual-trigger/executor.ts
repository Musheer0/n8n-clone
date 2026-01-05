import { NodeChannel } from "@/inngest/channels/node-channel"
import { NodeExexuteParams } from "../types"

export const MannualExecutor = async(params:NodeExexuteParams)=>{
    await params.publish(NodeChannel().status({status:"success",nodeId:params.node.id}))
    return {
        success:true
    }
}