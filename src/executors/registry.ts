import { tnode_type } from "@/db/types/workflow";
import { NodeExecutor } from "./types";
import { MannualExecutor } from "./manual-trigger/executor";
import { HttpExecutor } from "./http-executor/executor";
import { NonRetriableError } from "inngest";

type executors = Record<tnode_type,NodeExecutor>
export const executors:executors = {
    "manual":MannualExecutor,
    "http":HttpExecutor
}
export const getExecutor = (type:tnode_type)=>{
    const executor = executors[type]
    if(!executor) throw new NonRetriableError("executor not configured for-"+type);
    return executor
}