// page.tsx
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export default function Page() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {/* 移除了原来的grid布局，改为居中显示Next.js图标 */}
        <div className="flex-1 flex items-center justify-center">
          <Image src="/next.svg" alt="Next.js icon" width={200} height={200} />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  )
}