import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { CreateCredentialAlertDialog } from "@/features/credentials/components/create-credential"
import CredentialsList from "@/features/credentials/components/credentials"
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
            <h1 className="text-lg font-semibold">Credentials</h1>
            <p className="text-sm text-muted-foreground">
             Store you secrets entrypted in your database
            </p>
          </div>
        </div>

        <CreateCredentialAlertDialog>
          <Button size="sm" className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Create workflow
          </Button>
        </CreateCredentialAlertDialog>
      </header>

      {/* CONTENT */}
      <main className="flex-1 overflow-hidden">
        <CredentialsList />
      </main>
    </div>
  )
}

export default Page
