"use client";
import React, { memo, useState } from "react";
import BaseExecutionNode from "@/features/nodes/components/executers/base-execution-node";
import { NodeProps } from "@xyflow/react";
import GroqSettingsDialog from "./groq-settings";

const GroqNode = memo((props: NodeProps) => {
  const [open ,setOpen] = useState(false)
  return (
  <>
  <GroqSettingsDialog
  nodeId={props.id}
  data={props.data as any}
  open={open}
  onOpenChange={setOpen}

  />
    <BaseExecutionNode
      {...props}
      name="Groq"
      descritpion="Generate a ai text response"
      onSettings={()=>setOpen(true)}
      onDoubleClick={()=>setOpen(true)}
      icon={"/groq.svg"}

    />
  </>
  );
});

export default GroqNode;
