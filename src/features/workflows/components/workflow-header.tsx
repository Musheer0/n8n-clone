"use client"
import React from 'react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { SaveIcon } from 'lucide-react'
import { useWorkflowContext } from './workflow-provider'
import RenameWorkflow from './rename-workflow'

const WorkflowHeader = () => {
    const workflow = useWorkflowContext()

  return (
    <div className='w-full border-b px-2 py-3 flex items-center justify-between'>
      <div className="left flex items-center gap-2">
        <SidebarTrigger/>
        <RenameWorkflow/>
        <p className='text-xs text-muted-foreground'>unsaved changes</p>
      </div>
      <Button size={"sm"}>
        <SaveIcon/>
        Save Changes
      </Button>
    </div>
  )
}

export default WorkflowHeader
