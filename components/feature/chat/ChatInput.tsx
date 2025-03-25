"use client"
import { useState, FormEvent, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTextareaAutoHeight } from "@/hooks/useTextareaAutoHeight"
import { ChatInputButtons } from "@/components/feature/chat/ChatInputButtons"
import type { ChatInputProps } from "@/types/chatInput"

export function ChatInput({ onSubmit, onClear, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [isInferenceActive, setInferenceActive] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useTextareaAutoHeight(textareaRef, input)

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
      <div className="relative flex flex-col md:flex-row rounded-xl sm:rounded-2xl md:rounded-3xl border bg-background shadow-sm px-4">
        <ChatInputButtons
          onClear={onClear}
          isInferenceActive={isInferenceActive}
          onInferenceToggle={() => setInferenceActive(!isInferenceActive)}
        />

        <div className="relative flex-1 flex items-center">
          <textarea 
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="pl-4 pr-16 py-6 border-none focus-visible:outline-none focus-visible:ring-0 min-h-[60px] resize-none whitespace-pre-wrap break-words overflow-y-auto w-full rounded-md bg-transparent" 
            placeholder="询问任何问题" 
            rows={1}
            style={{ height: 'auto', minHeight: '60px', maxHeight: '200px', overflowY: 'auto' }}
          />

          <Button 
            type="submit" 
            variant="ghost" 
            size="icon" 
            disabled={disabled || !input.trim()}
            className="absolute right-4 hover:bg-gray-100/80 rounded-full"
          >
            {disabled ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">发送</span>
          </Button>
        </div>
      </div>
    </form>
  )
}

