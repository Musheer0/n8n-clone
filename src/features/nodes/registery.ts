import { NodeTypes } from "@xyflow/react";
import MannualTriggerNode from "./components/triggers/manual-trigger/manual-trigger-node";
import { TNodeRegistry } from "./types";
import HttpNode from "./components/executers/http-executor/http-node";
import GoogleFormTriggerNode from "./components/triggers/google-form-trigger/google-form-trigger-node";
import SmptMailNode from "./components/executers/smpt-mail-executor/smpt-mail-node";

export const NodeRegistry:TNodeRegistry ={
    "manual":MannualTriggerNode,
    "http":HttpNode,
    "googleForm":GoogleFormTriggerNode,
    "smpt_mail":SmptMailNode
} 