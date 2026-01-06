"use client";
import React, { memo, useState } from "react";
import BaseTriggerNode from "../base-trigger";
import { NodeProps } from "@xyflow/react";
import { MouseIcon } from "lucide-react";
import GoogleFormTriggerDialog from "./google-form-settings";
import { useParams } from "next/navigation";

const GoogleFormTriggerNode = memo((props: NodeProps) => {
    const [open ,setOpen] = useState(false);
    const {id} = useParams()
  if(id && typeof id=="string")
  return (
   <>

   <GoogleFormTriggerDialog
   workflowId={id}
  open={open}
  onOpenChange={setOpen}
   />
    <BaseTriggerNode
      {...props}
      name="Google Form Trigger"
      icon={'/gforms.svg'}
            onSettings={()=>setOpen(true)}
      onDoubleClick={()=>setOpen(true)}
    />

   </>
  );
});

export default GoogleFormTriggerNode;
