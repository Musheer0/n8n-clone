import WorkflowHeader from '@/features/workflows/components/workflow-header'
import WorkflowProvider from '@/features/workflows/components/workflow-provider'
import WorkflowEditor from '@/features/workflows/components/workfow-editor'
import { ReactFlowProvider } from '@xyflow/react'
import React from 'react'

const page = async({params}:{params:Promise<{id:string}>}) => {
  const {id} = await params
  return (
    <WorkflowProvider id={id}>
     <ReactFlowProvider>
      <div className='h-sreen flex-1 w-full p flex-col flex'>
       <WorkflowHeader/>
               <WorkflowEditor/>

     </div>
     </ReactFlowProvider>
    </WorkflowProvider>
  )
}

export default page
