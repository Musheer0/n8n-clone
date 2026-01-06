

import { NodeChannel } from "@/inngest/channels/node-channel"
import { NodeExexuteParams } from "../types"
import { NonRetriableError } from "inngest";
import { sendGMailSchema } from "./validator";
import { createTranspoter } from "./transporter";
import { sendGMail } from "./send-mail";
import handlebars from 'handlebars'
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
    try {
        const transporter = createTranspoter(data.smtp_user,data.smtp_passs);
        const {smtp_passs,smtp_user,...sendProps} = data
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