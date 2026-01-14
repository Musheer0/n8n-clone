import { NodeTypes } from "@xyflow/react";
import MannualTriggerNode from "./components/triggers/manual-trigger/manual-trigger-node";
import { TNodeRegistry } from "./types";
import HttpNode from "./components/executers/http-executor/http-node";
import GoogleFormTriggerNode from "./components/triggers/google-form-trigger/google-form-trigger-node";
import SmptMailNode from "./components/executers/smpt-mail-executor/smpt-mail-node";
import DiscordNode from "./components/executers/discord-executor/discord-node";
import WebhookTriggerNode from "./components/triggers/webhook-trigger/google-form-trigger-node";
import GeminiNode from "./components/executers/gemini-executor/discord-node";
import GroqNode from "./components/executers/groq-executor/groq-node";

export const NodeRegistry:TNodeRegistry ={
    "manual":MannualTriggerNode,
    "http":HttpNode,
    "googleForm":GoogleFormTriggerNode,
    "smpt_mail":SmptMailNode,
    "discord":DiscordNode,
    "webhook":WebhookTriggerNode,
    "gemini":GeminiNode,
    "groq":GroqNode
} 