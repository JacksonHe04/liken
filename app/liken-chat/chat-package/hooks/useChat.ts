import { useState } from 'react'
import { Message } from '../types/message'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleClear = () => {
    setMessages([])
  }

  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) throw new Error('请求失败')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = { role: 'assistant', content: '' }

      setMessages(prev => [...prev, assistantMessage])

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

              if (parsedData.done) break

              if (parsedData.text) {
                assistantMessage.content += parsedData.text
                setMessages(prev => {
                  const newMessages = [...prev]
                  const lastMessage = newMessages[newMessages.length - 1]
                  if (lastMessage?.role === 'assistant') {
                    lastMessage.content = assistantMessage.content
                    return newMessages
                  }
                  return newMessages
                })
              }
            } catch (e) {
              console.error('处理响应数据失败:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('发送消息失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    isLoading,
    handleClear,
    handleSubmit
  }
}