import { NonRetriableError } from "inngest";
import { NodeExecutor } from "../types";
import ky ,{HTTPError, type Options} from 'ky'
import handlebars from 'handlebars'
import { NodeChannel } from "@/inngest/channels/node-channel";
import { DiscordNodeSchema } from "@/features/nodes/components/executers/discord-executor/discord-settings";
import z from "zod";
handlebars.registerHelper("json",(ctx)=>new handlebars.SafeString(JSON.stringify(ctx,null,2)))
type HttpRequest =z.infer< typeof DiscordNodeSchema> & {
    _internal_variable_name?:string
}
export const DiscordExecutor: NodeExecutor = async ({
  context,
  node,
  step,
  publish

}) => {

  if (!node.data) {
    await publish(NodeChannel().status({ status: "error", nodeId: node.id }));
    throw new NonRetriableError("Http node is not configured");
  }

  const data = node.data as HttpRequest;

  if (!data.webhook|| !data.content ) {
    await publish(NodeChannel().status({ status: "error", nodeId: node.id }));
    throw new NonRetriableError("Discord node config incomplete");
  }

  return step.run("disccord-execution-"+node.id, async () => {
    await publish(NodeChannel().status({ status: "loading", nodeId: node.id }));
   
  if (!data.webhook|| !data.content) {
    await publish(NodeChannel().status({ status: "error", nodeId: node.id }));
    throw new NonRetriableError("Discord node config incomplete");
  }

    const url = handlebars.compile(data.webhook)(context);
    const content = handlebars.compile(data.content)(context)



    try {
   const res =  await ky.post(url,{
        json:{
          content:content.slice(0,2000),
        }
      }).text()
      console.log(res)


    await publish(NodeChannel().status({ status: "success", nodeId: node.id }));


      return {
        ...context,
       
      };

    } catch (err) {
        console.log(err)
      if (err instanceof HTTPError) {
    await publish(NodeChannel().status({ status: "error", nodeId: node.id }));

        return {
          ...context,
         
        };
      }

      // actual crash → let Inngest decide retry
      throw err;
    }
  });
};