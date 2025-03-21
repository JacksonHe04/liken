'use client'

import { ChatInput } from './components/chat-input/ChatInput'
import { ChatMessage } from './components/chat-message/ChatMessage'
import { useChat } from './hooks/useChat'

export function Chat() {
  const { messages, isLoading, handleSubmit, handleClear } = useChat()

  return (
    <div className="flex flex-col h-full border rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} role={message.role} content={message.content} />
        ))}
      </div>
      <div className="p-4 border-t">
        <ChatInput onSubmit={handleSubmit} onClear={handleClear} disabled={isLoading} />
      </div>
    </div>
  )
}