import type { ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex flex-col h-screen">
          <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
            <div className="flex-1"></div>
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-yellow-400 flex items-center justify-center text-white">ZI</div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

