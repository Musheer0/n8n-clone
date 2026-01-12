import { SidebarTrigger } from "@/components/ui/sidebar"
import ExecutionHistory from "@/features/execution-history/components/execution-history-list"

const Page = () => {
  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          {/* Sidebar toggle */}
          <SidebarTrigger />

          <div>
            <h1 className="text-lg font-semibold">Execution History</h1>
            <p className="text-sm text-muted-foreground">
             Your Execution History
            </p>
          </div>
        </div>

      </header>

      {/* CONTENT */}
      <main className="flex-1 p-5  overflow-hidden">
        <ExecutionHistory/>
      </main>
    </div>
  )
}

export default Page
