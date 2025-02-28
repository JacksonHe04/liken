"use client"
import { Mic, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ChatInput() {
  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative flex items-center rounded-full border bg-background shadow-sm">
        <Button variant="ghost" size="icon" className="absolute left-2">
          <Plus className="h-5 w-5" />
          <span className="sr-only">添加</span>
        </Button>

        <div className="flex gap-2 absolute left-12">
          <Button variant="ghost" size="sm" className="rounded-full text-xs flex items-center gap-1">
            <Search className="h-4 w-4" />
            <span>搜索</span>
          </Button>

          <Button variant="ghost" size="sm" className="rounded-full text-xs flex items-center">
            <span>Reason</span>
          </Button>
        </div>

        <Input className="pl-32 pr-12 py-6 border-none focus-visible:ring-0" placeholder="询问任何问题" />

        <Button variant="ghost" size="icon" className="absolute right-2 bg-black text-white rounded-full">
          <Mic className="h-5 w-5" />
          <span className="sr-only">语音输入</span>
        </Button>
      </div>
    </div>
  )
}

