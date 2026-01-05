import {channel,topic} from '@inngest/realtime'
export const NodeChannel  = channel("node-status-channel").addTopic(
    topic("status").type<{
        nodeId:string,
       status:"loading"|"success"|"error"
    }>()
)