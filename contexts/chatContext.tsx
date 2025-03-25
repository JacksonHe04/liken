"use client"

// 导入必要的模块和类型
import { createContext, useContext, useState, ReactNode } from "react"
import { chatDB } from "@/lib/db/chatDb"

// 定义消息类型
type Message = {
  role: 'user' | 'assistant' // 消息的角色，可以是用户或助手
  content: string // 消息的内容
}

// 定义聊天上下文类型
type ChatContextType = {
  sessionId: string | null // 会话ID，可以为null
  messages: Message[] // 消息数组
  isLoading: boolean // 加载状态
  setMessages: (messages: Message[]) => void // 设置消息的函数
  setIsLoading: (isLoading: boolean) => void // 设置加载状态的函数
  addMessage: (message: Message) => void // 添加消息的函数
  createSession: () => Promise<string> // 创建会话的函数，返回会话ID
  loadSession: (sessionId: string) => Promise<void> // 加载会话的函数
}

// 创建聊天上下文
const ChatContext = createContext<ChatContextType | undefined>(undefined)

// 聊天提供者组件
export function ChatProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null) // 会话ID状态
  const [messages, setMessages] = useState<Message[]>([]) // 消息状态
  const [isLoading, setIsLoading] = useState(false) // 加载状态

  // 创建新会话
  const createSession = async () => {
    const newSessionId = await chatDB.createSession() // 从数据库创建新会话
    setSessionId(newSessionId) // 设置新的会话ID
    setMessages([]) // 清空消息
    return newSessionId
  }

  // 加载现有会话
  const loadSession = async (id: string) => {
    const session = await chatDB.getSession(id) // 从数据库获取会话
    if (session) {
      setSessionId(id) // 设置会话ID
      setMessages(session.messages) // 设置会话中的消息
    }
  }

  // 添加新消息
  const addMessage = async (message: Message) => {
    console.log('[ChatContext] 添加新消息:', message)
    // 只有在消息不存在于当前列表时才添加
    setMessages(prev => {
      const messageExists = prev.some(m => 
        m.role === message.role && m.content === message.content
      )
      return messageExists ? prev : [...prev, message]
    })
    
    if (sessionId && !isLoading) {
      console.log('[ChatContext] 将消息保存到数据库, sessionId:', sessionId)
      await chatDB.addMessage(sessionId, message) // 将消息添加到数据库
    }
  }

  return (
    <ChatContext.Provider
      value={{
        sessionId,
        messages,
        isLoading,
        setMessages,
        setIsLoading,
        addMessage,
        createSession,
        loadSession
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

// 使用聊天上下文的自定义钩子
export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider') // 如果上下文未定义，抛出错误
  }
  return context
}