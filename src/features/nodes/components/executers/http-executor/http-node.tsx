"use client";
import React, { memo, useState } from "react";
import BaseExecutionNode from "@/features/nodes/components/executers/base-execution-node";
import { NodeProps } from "@xyflow/react";
import { GlobeIcon, MouseIcon } from "lucide-react";
import HttpSettingsDialog from "./http-settings";

const HttpNode = memo((props: NodeProps) => {
  const [open ,setOpen] = useState(false)
  return (
  <>
  <HttpSettingsDialog
  nodeId={props.id}
  data={props.data as any}
  open={open}
  onOpenChange={setOpen}

  />
    <BaseExecutionNode
      {...props}
      name="HTTP Execution"
      onSettings={()=>setOpen(true)}
      onDoubleClick={()=>setOpen(true)}
      icon={GlobeIcon}
            status="success"

    />
  </>
  );
});

export default HttpNode;
