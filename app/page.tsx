"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChatInput } from "@/components/chat-input"
import { LikeLogo } from "@/components/ui/logo/like-logo"
import { chatDB } from "@/lib/db/chat-db"
import { useChatContext } from "@/contexts/chat-context"

export default function Page() {
  const router = useRouter();
  const { setMessages, setIsLoading, messages, isLoading } = useChatContext();

  // 处理用户提交消息
  const handleSubmit = async (content: string) => {
    // 空消息或正在加载时直接返回
    if (!content.trim() || isLoading) return;
    setIsLoading(true);

    try {
      // 创建新的聊天会话
      const sessionId = await chatDB.createSession();
      // 构造用户消息对象
      const userMessage = { role: 'user' as const, content };
      // 将用户消息存入数据库
      await chatDB.addMessage(sessionId, userMessage);

      // 发送AI请求
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [userMessage] }),
      });

      if (!response.ok) throw new Error('AI请求失败');

      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: 'assistant' as const, content: '' };

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        // 解码并处理每个数据块
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(5).trim();
            if (!data) continue;

            try {
              const parsedData = JSON.parse(data);

              // 判断是否结束
              if (parsedData.done) {
                break;
              }

              // 拼接AI回复内容
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
      // 更新消息列表
      setMessages([userMessage, assistantMessage]);
      // 跳转到聊天页面
      router.push(`/chat/${sessionId}`);
    } catch (error) {
      console.error('处理消息失败:', error);
      setIsLoading(false);
    }
  };

  // 页面布局
  return (
    <>
      <div className="flex flex-col justify-center w-full h-3/4">
        <div className="flex flex-col gap-4 p-4 pt-0">
          {/* Logo和图片展示区域 */}
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <LikeLogo className="text-primary dark:text-primary-foreground" width={300} height={130} />
          </div>
          {/* 聊天输入区域 */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mt-4">
              <ChatInput onSubmit={handleSubmit} disabled={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}