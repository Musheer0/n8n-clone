"use client";
import React, { memo, useState } from "react";
import BaseExecutionNode from "@/features/nodes/components/executers/base-execution-node";
import { NodeProps } from "@xyflow/react";
import { GlobeIcon, MailIcon, MouseIcon } from "lucide-react";
import HttpSettingsDialog from "./discord-settings";
import EmailSettingsDialog from "./discord-settings";

const DiscordNode = memo((props: NodeProps) => {
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
      name="Send a discord message"
      onSettings={()=>setOpen(true)}
      onDoubleClick={()=>setOpen(true)}
      icon={"/discord.svg"}
            status="success"

    />
  </>
  );
});

export default DiscordNode;
