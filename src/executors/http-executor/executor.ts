import { NonRetriableError } from "inngest";
import { NodeExecutor } from "../types";
import ky ,{HTTPError, type Options} from 'ky'
import handlebars from 'handlebars'
import { NodeChannel } from "@/inngest/channels/node-channel";
handlebars.registerHelper("json",(ctx)=>new handlebars.SafeString(JSON.stringify(ctx,null,2)))
type HttpRequest ={
    url?:string,
    method?:"GET"|"POST"|"PUT"|"DELETE"|"PATCH";
    body?:string;
  _internal_variable_name?:string
}
export const HttpExecutor: NodeExecutor = async ({
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

  if (!data.url|| !data._internal_variable_name) {
    await publish(NodeChannel().status({ status: "error", nodeId: node.id }));
    throw new NonRetriableError("Http node config incomplete");
  }

  return step.run("http-execution-"+node.id, async () => {
    await publish(NodeChannel().status({ status: "loading", nodeId: node.id }));
  if (!data.url|| !data._internal_variable_name) {
    await publish(NodeChannel().status({ status: "error", nodeId: node.id }));
    throw new NonRetriableError("Http node config incomplete");
  }
    const url = handlebars.compile(data.url)(context);
    const method = data.method ?? "GET";

    const options: Options = { method };

    if (!["GET", "DELETE"].includes(method) && data.body) {
      options.body = handlebars.compile(data.body)(context);
    }

    try {
      const response = await ky(url, options);

      const contentType = response.headers.get("content-type") ?? "";
      const payload = contentType.includes("json")
        ? await response.json()
        : await response.text();
    await publish(NodeChannel().status({ status: "success", nodeId: node.id }));


      return {
        ...context,
        [data._internal_variable_name]: {
          http: {
            ok: true,
            status: response.status,
            statusText: response.statusText,
            data: payload,
          }
        }
      };

    } catch (err) {

      if (err instanceof HTTPError) {
    await publish(NodeChannel().status({ status: "error", nodeId: node.id }));

        return {
          ...context,
          [data._internal_variable_name]: {
            http: {
              ok: false,
              status: err.response.status,
              statusText: err.response.statusText,
              data: null,
            }
          }
        };
      }

      // actual crash → let Inngest decide retry
      throw err;
    }
  });
};