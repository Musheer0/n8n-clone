import WorkflowHeader from '@/features/workflows/components/workflow-header'
import WorkflowProvider from '@/features/workflows/components/workflow-provider'
import WorkflowEditor from '@/features/workflows/components/workfow-editor'
import React from 'react'

const page = async({params}:{params:Promise<{id:string}>}) => {
  const {id} = await params
  return (
    <WorkflowProvider id={id}>
     <div className='h-sreen flex-1 w-full p flex-col flex'>
       <WorkflowHeader/>
               <WorkflowEditor/>

     </div>
    </WorkflowProvider>
  )
}

export default page
