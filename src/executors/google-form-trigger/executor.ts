

import { NodeChannel } from "@/inngest/channels/node-channel"
import { NodeExexuteParams } from "../types"

export const GoogleFormExecutor = async(params:NodeExexuteParams)=>{
    await params.publish(NodeChannel().status({status:"success",nodeId:params.node.id}));
    return {
        gforms:{
            data:params.context
        }
    }
}