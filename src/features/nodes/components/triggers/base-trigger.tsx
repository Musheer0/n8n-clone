"use client"

import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react"
import { LucideIcon } from "lucide-react"

interface BaseTriggerNodeProps extends NodeProps {
    icon:LucideIcon|string,
    name?:string,
    descritpion?:string,
    status?:NodeStatus,
    onSettings?:()=>void,
    onDoubleClick?:()=>void,
    children?:React.ReactNode
}


import React, { memo } from 'react'
import { BaseNode, BaseNodeContent } from "../base-node"
import { NodeStatus } from "@/features/nodes/components/node-status-indicator"
import { WorkflowNode } from "../workflow-node"

const BaseTriggerNode:React.FC<BaseTriggerNodeProps> = memo((
    {
        id,
        icon:Icon,
        name,
        descritpion,
        status,
        onDoubleClick,
        onSettings,
        children
    }
) => {
const {setNodes,setEdges} = useReactFlow();
const handleDelete = ()=>{
  setNodes((currenttNodes)=>{
    const updated_nodes = currenttNodes.filter((n)=>n.id!==id)
    return updated_nodes
  });
  setEdges((currentEdges)=>{
    const updatedEdges = currentEdges.filter((e)=>e.source!==id && e.target!==id);
    return updatedEdges
  })
}
  return (

    <WorkflowNode
    name={name}
    description={descritpion}
    onDelete={handleDelete}
    onSettings={onSettings}
    showToolbar
    >
   <BaseNode status={status||"initial"} onDoubleClick={onDoubleClick}
   className="rounded-l-2xl relative group"
   >
   <BaseNodeContent>
   {typeof Icon ==="string"
   ? 
   <img src={Icon} className="w-10 h-10"/>
   :
   <Icon className="size-4 text-muted-foreground"/>
   }
   {children}

    <Handle
    id={"source-1"}
    type="source"
    position={Position.Right}
   /> 
   </BaseNodeContent>
   </BaseNode>
    </WorkflowNode>
  )
})

export default BaseTriggerNode