import { NodeTypes } from "@xyflow/react";
import MannualTriggerNode from "./components/triggers/manual-trigger/manual-trigger-node";
import { TNodeRegistry } from "./types";
import HttpNode from "./components/executers/http-executor/http-node";

export const NodeRegistry:TNodeRegistry ={
    "manual":MannualTriggerNode,
    "http":HttpNode
} 