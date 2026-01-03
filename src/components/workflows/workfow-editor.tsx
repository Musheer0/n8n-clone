"use client"
import { useState } from 'react';
import { Background, ColorMode, Controls, MiniMap, ReactFlow} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from 'next-themes';
 
const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];
 
export default function WorkflowEditor() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const {theme} = useTheme()
 
  return (
     <ReactFlow
        nodes={nodes}
        edges={edges}
        colorMode={theme as ColorMode}
        fitView
      >

           <Background/>
          <Controls/>
          <MiniMap/>
      </ReactFlow>
  );
}