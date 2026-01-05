"use server"

import { getSubscriptionToken, Realtime } from "@inngest/realtime"
import { NodeChannel } from "./channels/node-channel"
import { inngest } from "./client"

export type NodeStautsChannelToken = Realtime.Token<typeof NodeChannel,["status"]>

export async function fetchRealtimeNodeStatusToken():Promise<NodeStautsChannelToken>{
    const token =await getSubscriptionToken(inngest,{
        channel:NodeChannel(),
        topics:["status"]
    });
    return token
}