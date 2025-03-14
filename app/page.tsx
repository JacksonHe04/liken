"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { ChatInput } from "@/components/chat-input"
import { LikeLogo } from "@/components/ui/logo/like-logo"
import { ChatMessage } from "@/components/chat-message"
import { chatDB } from "@/lib/db/chat-db"
import { useChatContext } from "@/contexts/chat-context"

export default function Page() {
  const router = useRouter();
  const { setMessages, setIsLoading, messages, isLoading } = useChatContext();
  const [showLogo, setShowLogo] = useState(true);

  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const sessionId = await chatDB.createSession();
      const userMessage = { role: 'user' as const, content };
      await chatDB.addMessage(sessionId, userMessage);
      
      // 发送AI请求
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [userMessage] }),
      });

      if (!response.ok) throw new Error('AI请求失败');
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: 'assistant' as const, content: '' };

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
              }
            } catch (e) {
              console.error('处理响应数据失败:', e);
            }
          }
        }
      }

      // 保存AI回复到会话
      await chatDB.addMessage(sessionId, assistantMessage);
      setMessages([userMessage, assistantMessage]);
      router.push(`/chat/${sessionId}`);
    } catch (error) {
      console.error('处理消息失败:', error);
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