"use client"

import { MarkdownContent } from "./markdown-content"

type ChatMessageProps = {
  role: 'user' | 'assistant'
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-3xl rounded-2xl px-4 py-2 shadow-sm ${
          role === 'user' 
            ? 'bg-gray-100 dark:bg-gray-800 rounded-br-sm' 
            : 'bg-gray-100 dark:bg-gray-800 rounded-bl-sm'
        }`}
      >
        {role === 'assistant' ? <MarkdownContent content={content} /> : content}
      </div>
    </div>
  )
}