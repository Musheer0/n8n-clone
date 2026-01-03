import { Button } from "@/components/ui/button"
import CreateWorkflowButton from "@/components/workflows/create-workflow-button"
import { PlusIcon } from "lucide-react"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const page = () => {

  return (
    <div>
   <CreateWorkflowButton>
    <Button>
      <PlusIcon/>
      Create Workflow
    </Button>
   </CreateWorkflowButton>
   <ReactQueryDevtools/>
    </div>
  )
}

export default page
