"use client"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { ChatInput } from "@/components/chat-input"
import { ChatMessage } from "@/components/chat-message"
import { LikeLogo } from "@/components/ui/logo/like-logo"

export default function Page() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [showLogo, setShowLogo] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) return;

    setShowLogo(false);
    const userMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('请求失败');
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: 'assistant', content: '' };

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(5).trim();
            if (!data) continue;

            try {
              const parsedData = JSON.parse(data);
              
              if (parsedData.done) {
                break;
              }

              if (parsedData.text) {
                assistantMessage.content += parsedData.text;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage?.role === 'assistant') {
                    newMessages[newMessages.length - 1] = assistantMessage;
                  } else {
                    newMessages.push(assistantMessage);
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('处理响应数据失败:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('发送消息失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {showLogo && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <LikeLogo className="text-primary dark:text-primary-foreground" width={300} height={130} />
            <Image src="/next.svg" alt="Next.js icon" width={200} height={80} />
          </div>
        )}
        <div className="flex-1 flex flex-col justify-end">
          <div className="space-y-4 overflow-y-auto">
            {messages.map((message, index) => (
              <ChatMessage key={index} role={message.role} content={message.content} />
            ))}
          </div>
          <div className="mt-4">
            <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
          </div>
        </div>
      </div>
    </>
  )
}