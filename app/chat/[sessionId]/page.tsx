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
      console.log('[ChatPage] 开始初始化会话');
      const sessionId = unwrappedParams.sessionId;
      console.log('[ChatPage] 加载已有会话:', sessionId);
      await loadSession(sessionId);
      setIsLoading(false);
    };
    initSession();
  }, [unwrappedParams]);

  // 处理用户提交的消息内容，这是一个异步函数
  const handleSubmit = async (content: string) => {
    // 如果消息为空或者正在加载中，直接返回
    if (!content.trim() || isLoading) return;

    // 记录日志并更新UI状态
    console.log('[ChatPage] 开始处理用户消息:', content);
    setShowLogo(false); // 隐藏首页的Logo
    // 构造用户消息对象
    const userMessage = { role: 'user', content };
    setIsLoading(true); // 设置加载状态

    // 立即将用户消息添加到消息列表中，实现即时反馈
    setMessages(prev => [...prev, userMessage]);

    try {
      // 向后端API发送POST请求，包含历史消息和当前用户消息
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      // 检查响应状态
      if (!response.ok) throw new Error('请求失败');

      // 初始化流式响应处理
      const reader = response.body?.getReader(); // 获取响应流的读取器
      const decoder = new TextDecoder(); // 用于将字节数据解码为文本
      // 初始化AI助手的响应消息
      let assistantMessage = { role: 'assistant', content: '' };

      console.log('[ChatPage] 开始接收AI响应');
      // 预先在UI中显示一个空的AI响应，后续会逐步填充内容
      setMessages(prev => [...prev, assistantMessage]);

      // 持续读取响应流
      while (reader) {
        // 读取一个数据块
        const { done, value } = await reader.read();
        // 如果读取完成，退出循环
        if (done) break;

        // 将字节数据解码为文本
        const chunk = decoder.decode(value);
        // 按换行符分割，因为SSE格式是按行发送的
        const lines = chunk.split('\n');

        // 处理每一行数据
        for (const line of lines) {
          // SSE格式的数据以 "data: " 开头
          if (line.startsWith('data: ')) {
            const data = line.slice(5).trim(); // 移除 "data: " 前缀
            if (!data) continue; // 跳过空数据

            try {
              // 解析JSON数据
              const parsedData = JSON.parse(data);

              // 如果收到完成标记，结束处理
              if (parsedData.done) {
                break;
              }

              // 如果收到文本内容
              if (parsedData.text) {
                // 将新内容追加到AI响应中
                assistantMessage.content += parsedData.text;
                console.log('[ChatPage] 收到AI响应片段:', parsedData.text);

                // 更新UI中显示的AI响应内容
                // 注意这里使用函数式更新以确保状态更新的准确性
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage?.role === 'assistant') {
                    lastMessage.content = assistantMessage.content;
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

      console.log('[ChatPage] AI响应完成，保存到数据库');
      // 将用户消息和完整的AI响应保存到数据库
      await addMessage(userMessage);
      await addMessage({ ...assistantMessage, content: assistantMessage.content });
    } catch (error) {
      // 错误处理
      console.error('发送消息失败:', error);
    } finally {
      // 无论成功失败，都需要重置加载状态
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