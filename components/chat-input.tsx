"use client"
import { useState, FormEvent, useEffect, useRef } from "react"
import { Mic, Plus, Search, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ChatInputProps = {
  onSubmit: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSubmit, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSubmit(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        e.preventDefault()
        const cursorPosition = e.currentTarget.selectionStart
        const newValue = input.slice(0, cursorPosition) + '\n' + input.slice(cursorPosition)
        setInput(newValue)
      } else {
        handleSubmit(e as unknown as FormEvent)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto">
      <div className="relative flex items-center rounded-full border bg-background shadow-sm px-4">
        <Button type="button" variant="ghost" size="icon" className="absolute left-8">
          <Plus className="h-5 w-5" />
          <span className="sr-only">添加</span>
        </Button>

        <div className="flex gap-2 absolute left-16">
          <Button type="button" variant="ghost" size="sm" className="rounded-full text-xs flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100/80">
            <Search className="h-3.5 w-3.5" />
            <span>搜索</span>
          </Button>

          <Button type="button" variant="ghost" size="sm" className="rounded-full text-xs flex items-center px-3 py-1.5 hover:bg-gray-100/80">
            <span>Reason</span>
          </Button>
        </div>

        <textarea 
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            // 自动调整高度
            if (textareaRef.current) {
              textareaRef.current.style.height = 'auto'
              textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
            }
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="pl-52 pr-16 py-6 border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[60px] resize-none whitespace-pre-wrap break-words overflow-y-auto w-full rounded-md bg-transparent" 
          placeholder="询问任何问题" 
          rows={1}
          style={{ height: 'auto', minHeight: '60px', maxHeight: '200px', overflowY: 'auto' }}
        />

        <Button 
          type="submit" 
          variant="ghost" 
          size="icon" 
          disabled={disabled || !input.trim()}
          className="absolute right-8 hover:bg-gray-100/80 rounded-full"
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

