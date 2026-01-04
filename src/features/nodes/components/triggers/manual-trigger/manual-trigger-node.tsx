"use client";
import React, { memo } from "react";
import BaseTriggerNode from "../base-trigger";
import { NodeProps } from "@xyflow/react";
import { MouseIcon } from "lucide-react";

const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <BaseTriggerNode
      {...props}
      name="Manual Trigger"
      icon={MouseIcon}
    />
  );
});

export default ManualTriggerNode;
