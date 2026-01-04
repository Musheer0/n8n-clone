"use client";
import React, { memo } from "react";
import BaseExecutionNode from "@/features/nodes/components/executers/base-execution-node";
import { NodeProps } from "@xyflow/react";
import { GlobeIcon, MouseIcon } from "lucide-react";

const HttpExecutorNode = memo((props: NodeProps) => {
  return (
    <BaseExecutionNode
      {...props}
      name="HTTP Execution"
      
      icon={GlobeIcon}
    />
  );
});

export default HttpExecutorNode;
