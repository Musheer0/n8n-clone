"use client"

import React, { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {createId} from '@paralleldrive/cuid2'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { tnode_type } from '@/db/types/workflow'
import {
  GlobeIcon,
  LucideIcon,
  MailIcon,
  MouseIcon,
  PlusIcon,
  XIcon
} from 'lucide-react'
import { useReactFlow } from '@xyflow/react'
import { toast } from 'sonner'

type nodelist = {
  type: "triggers" | "executors",
  nodes: NodeTypeOption[]
}[]
type NodeTypeOption ={
     
        name: string
        description: string
        type: tnode_type
        icon: LucideIcon|string
      
}
const nodelist: nodelist = [
  {
    type: "triggers",
    nodes: [
      {
        name: "Manual Trigger",
        description: "trigger a workflow mannualy",
        type: "manual",
        icon: MouseIcon
      },
       {
        name: "Google Forms Trigger",
        description: "trigger a workflow through google forms",
        type: "googleForm",
        icon: '/gforms.svg'
      }
    ]
  },
  {
    type: "executors",
    nodes: [
      {
        name: "Http Execution",
        description: "execute a http request and use its data accross workflows",
        type: "http",
        icon: GlobeIcon
      },
         {
        name: "Mail Execution",
        description: "execute a smpt mail",
        type: "smpt_mail",
        icon: MailIcon
      },
       {
        name: "Discord ",
        description: "Send a discord message",
        type: "discord",
        icon: '/discord.svg'
      }
    ]
  }
]

const NodeSelector = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState("")
  const {addNodes,setNodes,screenToFlowPosition,getNodes} = useReactFlow()
  const [open ,  onOpenChange] = useState(false)
  // filtered list (computed, not stored → less bugs, less pain)
  const filteredNodeList = useMemo(() => {
    if (!search.trim()) return nodelist

    const q = search.toLowerCase()

    return nodelist
      .map(section => ({
        ...section,
        nodes: section.nodes.filter(node =>
          node.name.toLowerCase().includes(q) ||
          node.description.toLowerCase().includes(q)
        )
      }))
      .filter(section => section.nodes.length > 0)
  }, [search])
 const handleNodeSelect = useCallback((nodeType:NodeTypeOption)=>{
         setNodes((n)=>{
               const nodes = getNodes()
        if(nodeType.type==="manual"){
            const hansManualTriggle = nodes.some((n)=>n.type==="manual")
            if(hansManualTriggle){
                toast.error("only one manual trigger is allowed");
                return nodes;
            }   
        }
           const cx = window.innerWidth/2;
           const cy = window.innerHeight/2;
           const flowPosition = screenToFlowPosition({
            x:cx+(Math.random()-0.5)*200,
            y:cy+(Math.random()-0.5)*200,
           });
           const newNode = {
            id:createId(),
            data:{},
            position:flowPosition,
            type:nodeType.type
           };
        onOpenChange(false)

           return [...nodes,newNode]
         })


    },[setNodes,getNodes,screenToFlowPosition, onOpenChange])
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nodes</SheetTitle>
          <SheetDescription>
            use different nodes to automate your boring stuff
          </SheetDescription>

          <div className="w-full py-2 relative">
            <Input
              placeholder="Search Nodes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setSearch("")}
              >
                <XIcon className="size-4" />
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-2 w-full py-2">
          {filteredNodeList.length === 0 && (
            <p className="text-sm text-muted-foreground px-4">
              No nodes found. Skill issue? 😔
            </p>
          )}

          {filteredNodeList.map((list, i) => (
            <div key={i} className="flex flex-col gap-2 w-full">
              <p className="px-3 text-xs text-muted-foreground">
                {list.type}
              </p>

              {list.nodes.map((e, i) => (
                <div
                 onClick={()=>handleNodeSelect(e)}
                  key={i}
                  className="flex group px-4 cursor-pointer hover:bg-muted-foreground/10 py-5 items-center justify-between w-full"
                >
                  {typeof e.icon === "string" ? (
                    <img src={e.icon} alt={e.name} className="size-6" />
                  ) : (
                    <e.icon className="text-muted-foreground" />
                  )}

                  <div className="info flex flex-col px-4 flex-1 items-start">
                    <p className="font-semibold leading-none">{e.name}</p>
                    <p className="text-xs leading-none pt-1 text-muted-foreground">
                      {e.description}
                    </p>
                  </div>

                  <Button variant="outline" size="icon">
                    <PlusIcon />
                  </Button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default NodeSelector
