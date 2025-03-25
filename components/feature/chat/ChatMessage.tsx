"use client" // 标记为客户端组件

import { MarkdownContent } from "./MarkdownContent"

// 定义ChatMessage组件的props类型
type ChatMessageProps = {
  role: 'user' | 'assistant' // 消息角色：用户或助手
  content: string // 消息内容
}

// ChatMessage组件，用于显示单条聊天消息
export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    // 外层容器，根据消息角色调整对齐方式
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* 消息内容容器，设置最大宽度、圆角、阴影等样式 */}
      <div 
        className={`max-w-3xl rounded-2xl px-4 py-2 shadow-sm ${
          role === 'user' 
            ? 'bg-gray-100 dark:bg-gray-800 rounded-br-sm' 
            : 'bg-gray-100 dark:bg-gray-800 rounded-bl-sm'
        }`}
      >
        {/* 如果是助手消息，使用MarkdownContent组件渲染；否则直接显示文本 */}
        {role === 'assistant' ? <MarkdownContent content={content} /> : content}
      </div>
    </div>
  )
}