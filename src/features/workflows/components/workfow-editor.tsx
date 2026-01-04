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
import { PlusIcon } from 'lucide-react'
import { useCallback } from 'react'
import { useWorkflowContext } from './workflow-provider'
export default function WorkflowEditor() {
  const { theme } = useTheme()
  const workflow = useWorkflowContext();
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds))
    },
    []
  )

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
    </ReactFlow>
   </>
  )
}
