"use client";
import React, { memo, useState } from "react";
import BaseExecutionNode from "@/features/nodes/components/executers/base-execution-node";
import { NodeProps } from "@xyflow/react";
import { GlobeIcon, MailIcon, MouseIcon } from "lucide-react";
import HttpSettingsDialog from "./smpt-mail-settings";
import EmailSettingsDialog from "./smpt-mail-settings";

const SmptMailNode = memo((props: NodeProps) => {
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
      name="Mail Execution"
      onSettings={()=>setOpen(true)}
      onDoubleClick={()=>setOpen(true)}
      icon={MailIcon}
            status="success"

    />
  </>
  );
});

export default SmptMailNode;
