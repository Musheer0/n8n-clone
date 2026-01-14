"use client";
import React, { memo, useState } from "react";
import BaseExecutionNode from "@/features/nodes/components/executers/base-execution-node";
import { NodeProps } from "@xyflow/react";
import { GlobeIcon, MailIcon, MouseIcon } from "lucide-react";
import HttpSettingsDialog from "./gemini-settings";
import EmailSettingsDialog from "./gemini-settings";

const GeminiNode = memo((props: NodeProps) => {
  const [open ,setOpen] = useState(false)
  return (
  <>
  <EmailSettingsDialog
  nodeId={props.id}
  data={props.data as any}
  open={open}
  onOpenChange={setOpen}

  />
    <BaseExecutionNode
      {...props}
      name="Gemini"
      descritpion="Generate a ai text response"
      onSettings={()=>setOpen(true)}
      onDoubleClick={()=>setOpen(true)}
      icon={"/gemini.png"}

    />
  </>
  );
});

export default GeminiNode;
