"use client";
import React, { memo, useState } from "react";
import BaseTriggerNode from "../base-trigger";
import { NodeProps } from "@xyflow/react";
import { MouseIcon, WebhookIcon } from "lucide-react";
import WebhookTriggerDialog from "./webhook-trigger-settings";
import { useParams } from "next/navigation";

const WebhookTriggerNode = memo((props: NodeProps) => {
    const [open ,setOpen] = useState(false);
    const {id} = useParams()
  if(id && typeof id=="string")
  return (
   <>

   <WebhookTriggerDialog
   workflowId={id}
  open={open}
  onOpenChange={setOpen}
   />
    <BaseTriggerNode
      {...props}
      name="Webhook Trigger"
      icon={WebhookIcon}
            onSettings={()=>setOpen(true)}
      onDoubleClick={()=>setOpen(true)}
    />

   </>
  );
});

export default WebhookTriggerNode;
