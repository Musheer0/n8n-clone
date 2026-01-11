

import { NodeChannel } from "@/inngest/channels/node-channel"
import { NodeExexuteParams } from "../types"
import { NonRetriableError } from "inngest";
import { sendGMailSchema } from "./validator";
import { createTranspoter } from "./transporter";
import { sendGMail } from "./send-mail";
import handlebars from 'handlebars'
import { caller } from "@/trpc/server";
import { getCredentialKey } from "@/redis/keys/credentials";
import { checkCacheAndQuery } from "@/redis/utils/caache-exists";
import { tcredentials } from "@/db/types/credentials";
import db from "@/db";
import { and, eq } from "drizzle-orm";
import { credentails } from "../../../drizzle/schema";
import { decrypt } from "@/lib/encrypt-decrypt";
handlebars.registerHelper("json",(ctx)=>new handlebars.SafeString(JSON.stringify(ctx,null,2)))
export const MailSenderExecutor = async(params:NodeExexuteParams)=>{
    await params.publish(NodeChannel().status({status:"loading",nodeId:params.node.id}));
    if(!params.args) {
       await params.publish(NodeChannel().status({status:"error",nodeId:params.node.id}));
       throw new NonRetriableError("missing args")
    }
    const compiled_data = handlebars.compile(JSON.stringify(params.args))(params.context);
    const {data,error} = sendGMailSchema.safeParse(JSON.parse(compiled_data));
  
      if(error) {
       await params.publish(NodeChannel().status({status:"error",nodeId:params.node.id}));
       throw new NonRetriableError(error.message)
    }
      if(!data?.to ||!data?.from || !data.subject || (!data?.content  && !data.html )){
           await params.publish(NodeChannel().status({status:"error",nodeId:params.node.id}));
       throw new NonRetriableError("smtp mail not configured")
    }
    try {

          const cacheKey = getCredentialKey(
                data.credentialId,
                "smpt.gmail"
              );
        const credential = await checkCacheAndQuery<tcredentials>(cacheKey,()=>{
            return db.query.credentails.findFirst({
                where:and(eq(credentails.id,data.credentialId),eq(credentails.type,"smpt.gmail"))
            })
        });
        if(!credential) throw new NonRetriableError("credential not found");
        const smtp_pass = decrypt(credential.userId,credential.credential)
        const transporter = createTranspoter(data.from,smtp_pass);
        const {from,...sendProps} = data
        await sendGMail({...sendProps,transporter});
               await params.publish(NodeChannel().status({status:"success",nodeId:params.node.id}));
        return {
            ...params.context,
            smpt_mail:{
                sent:true
            }
        }
    } catch (error) {
        console.log(error)
               await params.publish(NodeChannel().status({status:"error",nodeId:params.node.id}));
       throw new NonRetriableError("somthing went wrong")
    }
}