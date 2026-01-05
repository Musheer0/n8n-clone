"use client"

import { tworkflow } from "@/db/types/workflow"
import { useWorkflow } from "@/hooks/use-workflows";
import { Loader2Icon, OctagonX } from "lucide-react";
import { createContext, useContext } from "react"

const workflowContext = createContext<tworkflow|null>(null);
import React from 'react'

const WorkflowProvider = ({id,children}:{id:string,children:React.ReactNode}) => {
    const {data,isLoading,isError,error} = useWorkflow(id)

  if(isLoading)
    return(
        <div className="flex items-center justify-center w-full h-screen">
            <Loader2Icon className="animate-spin"/>
        </div>
    )
   if(isError)
    return(
        <div className="flex text-destructive items-center justify-center flex-col w-full h-screen">
           <p className="flex items-center gap-2">
            <OctagonX size={14}/>
            Error
           </p>
           <p className="text-xs">{error.message}</p>
        </div>
    )
  return (
    <workflowContext.Provider value={data||null}>
       {children}
    </workflowContext.Provider>
  )
}

export default WorkflowProvider

export const useWorkflowContext = ()=>{
    const context = useContext(workflowContext)
    if(!context) throw new Error("useWorkflowContext must be used withing workflowProvider")
    return context
}