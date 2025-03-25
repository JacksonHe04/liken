"use client"
import { useState, useEffect, use } from "react"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { ChatInput } from "@/components/feature/chat/ChatInput"
import { ChatMessage } from "@/components/feature/chat/ChatMessage"
import { LikeLogo } from "@/components/ui/logo/like-logo"
import { useChatContext } from "@/contexts/chatContext"
import { ChatService } from "@/services/chat/chatService"

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
      console.log('[ChatPage] 开始初始化会话');
      const sessionId = unwrappedParams.sessionId;
      console.log('[ChatPage] 加载已有会话:', sessionId);
      await loadSession(sessionId);
      setIsLoading(false);
    };
    initSession();
  }, [unwrappedParams]);

  // 处理用户提交的消息内容，这是一个异步函数
  // 处理用户提交消息
  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) return;
  
    console.log('[ChatPage] 开始处理用户消息:', content);
  setShowLogo(false);
  const userMessage = { role: 'user', content };
  setIsLoading(true);
  
  // 更新UI显示用户消息
  setMessages(prev => [...prev, userMessage]);
  
  try {
    let assistantMessage = { role: 'assistant', content: '' };
    console.log('[ChatPage] 开始接收AI响应');
    setMessages(prev => [...prev, assistantMessage]);
  
    // 使用 ChatService 处理流式响应
    const stream = await ChatService.streamChat([...messages, userMessage]);
    
    for await (const parsedData of ChatService.processStream(stream)) {
      if (parsedData.done) break;
      
      if (parsedData.text) {
        assistantMessage.content += parsedData.text;
        console.log('[ChatPage] 收到AI响应片段:', parsedData.text);
        
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.role === 'assistant') {
            lastMessage.content = assistantMessage.content;
          }
          return newMessages;
        });
      }
    }
  
    console.log('[ChatPage] AI响应完成，保存到数据库');
    await addMessage(userMessage);
    await addMessage({ ...assistantMessage, content: assistantMessage.content });
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