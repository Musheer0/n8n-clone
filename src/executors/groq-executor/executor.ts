

import { NodeChannel } from "@/inngest/channels/node-channel"
import { NodeExexuteParams } from "../types"
import { groqData } from "./schema";
import { NonRetriableError } from "inngest";
import { checkCacheAndQuery } from "@/redis/utils/caache-exists";
import { tcredentials } from "@/db/types/credentials";
import { getCredentialKey } from "@/redis/keys/credentials";
import { and, eq } from "drizzle-orm";
import { credentails } from "../../../drizzle/schema";
import { decrypt } from "@/lib/encrypt-decrypt";
import { getGroqResponse } from "./utils";
import handlebars from 'handlebars'
import db from "@/db";
handlebars.registerHelper("json",(ctx)=>new handlebars.SafeString(JSON.stringify(ctx,null,2)))
export const GroqAiExecutor = async(params:NodeExexuteParams)=>{
    await params.publish(NodeChannel().status({status:"loading",nodeId:params.node.id}));
    const {data,error} = groqData.safeParse(params.node.data)
    if(error) {
            await params.publish(NodeChannel().status({status:"error",nodeId:params.node.id}));

        throw new NonRetriableError(error.message);}
        const cacheKey = getCredentialKey(
                    data.credentialId,
                    "groq"
                  );
      const credential = await checkCacheAndQuery<tcredentials>(cacheKey,()=>{
            return db.query.credentails.findFirst({
                where:and(eq(credentails.id,data.credentialId),eq(credentails.type,"groq"))
            })
        });
    if(!credential) {
        console.log(data)
            await params.publish(NodeChannel().status({status:"error",nodeId:params.node.id}));
        throw new NonRetriableError("credential not found");}
    const api_key =  decrypt(credential.userId,credential.credential);
    const sys_prompt = handlebars.compile(data.systemprompt)(params.context);
     const user_prompt = handlebars.compile(data.userprompt)(params.context);
   try {
     const response =await getGroqResponse(
        {api_key,
        model:data.model as any,
        systemprompt:sys_prompt,
        userprompt:user_prompt
    });
         await params.publish(NodeChannel().status({status:"success",nodeId:params.node.id}));

    return {
        ...params.context,
        [data._internal_variable_name]:{
            response
        }
    }
   } catch (error) {
                await params.publish(NodeChannel().status({status:"error",nodeId:params.node.id}));

    console.log(error)
    throw new NonRetriableError("internal error")
   }
}