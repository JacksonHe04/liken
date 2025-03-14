"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type ChatContextType = {
  messages: Message[]
  isLoading: boolean
  setMessages: (messages: Message[]) => void
  setIsLoading: (isLoading: boolean) => void
  addMessage: (message: Message) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message])
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        setMessages,
        setIsLoading,
        addMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}