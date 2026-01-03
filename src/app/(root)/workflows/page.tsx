import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import CreateWorkflowButton from "@/components/workflows/create-workflow-button"
import WorkflowList from "@/components/workflows/workflow-list"
import { PlusIcon } from "lucide-react"

const Page = () => {
  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Sidebar toggle */}
          <SidebarTrigger />

          <div>
            <h1 className="text-lg font-semibold">Workflows</h1>
            <p className="text-sm text-muted-foreground">
              Automate things so you don’t have to think.
            </p>
          </div>
        </div>

        <CreateWorkflowButton>
          <Button size="sm" className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Create workflow
          </Button>
        </CreateWorkflowButton>
      </header>

      {/* CONTENT */}
      <main className="flex-1 overflow-hidden">
        <WorkflowList />
      </main>
    </div>
  )
}

export default Page
