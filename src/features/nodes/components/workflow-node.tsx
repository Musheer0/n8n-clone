"use client"

import { NodeToolbar, Position } from "@xyflow/react"
import { Button } from "@/components/ui/button"
import { SettingsIcon, TrashIcon } from "lucide-react"

interface WorkflowNodeProps{
    children:React.ReactNode,
    showToolbar?:boolean,
    onDelete?:()=>void,
    onSettings?:()=>void,
    name?:string,
    description?:string
}

export function WorkflowNode({
    children,showToolbar,onDelete,onSettings,name,description
}:WorkflowNodeProps){
    

    return (
        <>
        {showToolbar &&
        
        <NodeToolbar>
            <Button size={"sm"} variant={"ghost"} onClick={onSettings}>
                <SettingsIcon size={14}/>
            </Button>
            <Button size={"sm"} variant={"ghost"} onClick={onDelete}>
                <TrashIcon size={14}/>
            </Button>
        </NodeToolbar>
        }
        {children}
        {name &&
        <NodeToolbar
        position={Position.Bottom}
        isVisible
        className="max-w-[200px] text-center"
        >
      <p className="font-medium">{name}</p>
      {description &&
      <p className="text-xs  truncate text-muted-foreground">
        {description}
      </p>
      }
        </NodeToolbar>
        }
        </>
    )
}