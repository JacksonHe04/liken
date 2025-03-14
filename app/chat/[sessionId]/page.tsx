"use client"
import { useState, useEffect, use } from "react"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { ChatInput } from "@/components/chat-input"
import { ChatMessage } from "@/components/chat-message"
import { LikeLogo } from "@/components/ui/logo/like-logo"
import { useChatContext } from "@/contexts/chat-context"

// 聊天页面主组件
export default function ChatPage({ params }: { params: { sessionId: string } }) {
  // 从聊天上下文中获取所需状态和方法
  const { messages, setMessages, isLoading, setIsLoading, loadSession, createSession, addMessage } = useChatContext();
  // 控制是否显示Logo的状态
  const [showLogo, setShowLogo] = useState(messages.length === 0);

  // 使用use hook解构params对象
  const unwrappedParams = use(params); // 将 use 调用移到组件顶层

  // 初始化会话的副作用
  useEffect(() => {
    const initSession = async () => {
      const sessionId = unwrappedParams.sessionId; // 使用解包后的 sessionId
      // 根据sessionId决定是创建新会话还是加载已有会话
      if (sessionId === 'new') {
        await createSession();
      } else {
        await loadSession(sessionId);
      }
      setIsLoading(false);
      // 检查是否需要自动发送请求获取AI回复
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'user') {
        handleSubmit(lastMessage.content);
      }
    };
    initSession();
  }, [unwrappedParams]); // 监听解包后的 params 的变化

  // 处理用户提交消息
  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) return;

    setShowLogo(false);
    const userMessage = { role: 'user', content };
    await addMessage(userMessage);
    setIsLoading(true);
  
    try {
      // 发送消息到API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
  
      if (!response.ok) throw new Error('请求失败');
      
      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: 'assistant', content: '' };
  
      // 先添加一个空的assistant消息
      await addMessage(assistantMessage);
  
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
                    lastMessage.content = assistantMessage.content;
                    return newMessages;
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

  // 页面渲染
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