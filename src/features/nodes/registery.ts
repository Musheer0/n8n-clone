import { NodeTypes } from "@xyflow/react";
import MannualTriggerNode from "./components/triggers/manual-trigger/manual-trigger-node";
import { TNodeRegistry } from "./types";
import HttpExecutorNode from "./components/executers/http-executor/http-executor";

export const NodeRegistry:TNodeRegistry ={
    "manual":MannualTriggerNode,
    "http":HttpExecutorNode
} 