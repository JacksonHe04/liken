"use client"
import { useState, FormEvent } from "react"
import { Mic, Plus, Search, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ChatInputProps = {
  onSubmit: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSubmit, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSubmit(input)
      setInput('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto">
      <div className="relative flex items-center rounded-full border bg-background shadow-sm">
        <Button type="button" variant="ghost" size="icon" className="absolute left-2">
          <Plus className="h-5 w-5" />
          <span className="sr-only">添加</span>
        </Button>

        <div className="flex gap-2 absolute left-12">
          <Button type="button" variant="ghost" size="sm" className="rounded-full text-xs flex items-center gap-1">
            <Search className="h-4 w-4" />
            <span>搜索</span>
          </Button>

          <Button type="button" variant="ghost" size="sm" className="rounded-full text-xs flex items-center">
            <span>Reason</span>
          </Button>
        </div>

        <Input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          className="pl-32 pr-12 py-6 border-none focus-visible:ring-0" 
          placeholder="询问任何问题" 
        />

        <Button 
          type="submit" 
          variant="ghost" 
          size="icon" 
          disabled={disabled || !input.trim()}
          className="absolute right-2 bg-black text-white rounded-full hover:bg-gray-800"
        >
          {disabled ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span className="sr-only">发送</span>
        </Button>
      </div>
    </form>
  )
}

