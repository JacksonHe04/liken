"use client"

import { useState } from "react"
import { ChatInput } from "@/components/chat-input"
import { ChatMessage } from "@/components/chat-message"

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) return

    // 添加用户消息
    const userMessage = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // 发送请求到API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) throw new Error('请求失败')
      
      // 处理流式响应
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = { role: 'assistant', content: '' }

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(5).trim()
            if (!data) continue

            try {
              const parsedData = JSON.parse(data)
              
              if (parsedData.done) {
                break
              }

              if (parsedData.text) {
                assistantMessage.content += parsedData.text
                setMessages(prev => {
                  const newMessages = [...prev]
                  newMessages[newMessages.length - 1] = assistantMessage
                  return newMessages
                })
              }
            } catch (e) {
              console.error('处理响应数据失败:', e);
            }
          }
        }
      }

      // 移除重复添加消息的代码
    } catch (error) {
      console.error('发送消息失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-between h-full">
      <div className="flex-1 w-full overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
      </div>

      <div className="w-full p-4 pb-8">
        <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
        <div className="text-center text-sm text-muted-foreground mt-4">
          ChatGPT 也可能会犯错。请检查重要信息。
        </div>
      </div>
    </div>
  )
}

