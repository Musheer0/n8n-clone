import WorkflowHeader from '@/components/workflows/workflow-header'
import WorkflowProvider from '@/components/workflows/workflow-provider'
import WorkflowEditor from '@/components/workflows/workfow-editor'
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
