"use client"

import {
  Background,
  ColorMode,
  Controls,
  ReactFlow,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useTheme } from 'next-themes'
import { NodeRegistry } from '@/features/nodes/registery'
import NodeSelector from './node-selector'
import { Button } from '@/components/ui/button'
import { Loader2Icon, OctagonX, PlusIcon } from 'lucide-react'
import { useCallback, useEffect } from 'react'
import { useWorkflowContext } from './workflow-provider'
import { useWorkflowNodes } from '@/hooks/use-workflows'
import ExecuteWorkflowButton from './execute-workflow-button'
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { fetchRealtimeNodeStatusToken } from '@/inngest/action'
import { useAtom } from 'jotai'
import { nodeStatusAtom } from '@/store/node-status-store'


export default function WorkflowEditor() {
  const { theme } = useTheme()
  const workflow = useWorkflowContext();
  const {data,isPending,isError,error} = useWorkflowNodes(workflow.id)
  const [nodes, setNodes, onNodesChange] = useNodesState(data?.nodes||[])
  const [edges, setEdges, onEdgesChange] = useEdgesState(data?.edges||[])
 const {data:nodeStatusData,latestData} = useInngestSubscription({
  refreshToken:fetchRealtimeNodeStatusToken
 });
 const [atom,setAtom] = useAtom(nodeStatusAtom)
useEffect(() => {
  if (!latestData?.data) return;

  const { nodeId, status } = latestData.data;

  setAtom((prev) => {
    const exists = prev.some((n) => n.nodeId === nodeId);

    if (exists) {
      // update status
      return prev.map((n) =>
        n.nodeId === nodeId
          ? { ...n, status }
          : n
      );
    }

    // push new node
    return [...prev, { nodeId, status }];
  });
}, [latestData, setAtom]);

  useEffect(()=>{
   if(data){
     setNodes(data?.nodes||[]);
    setEdges(data?.edges||[]);
   }
  },[isPending,data])
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds))
    },
    []
  )

if(isPending){
  return (
    <div className='size-full flex items-center justify-center'>
      <Loader2Icon className='animate-spin'/>
    </div>
  )
}
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
if(!isPending)
  return (
   <>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={NodeRegistry}
      colorMode={theme as ColorMode}
      fitView
    >
      <Background />
      <Controls />

      <Panel>
        <NodeSelector>
          <Button size="icon">
            <PlusIcon />
          </Button>
        </NodeSelector>
      </Panel>
      <Panel position='bottom-center'>
        <ExecuteWorkflowButton/>
      </Panel>
    </ReactFlow>
   </>
  )
}
