import { ChatInput } from "@/components/chat-input"

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center justify-between h-full">
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <h1 className="text-3xl font-medium mb-8">有什么可以帮忙的?</h1>
        {/* 这里可以添加聊天消息列表 */}
      </div>

      <div className="w-full p-4 pb-8">
        <ChatInput />
        <div className="text-center text-sm text-muted-foreground mt-4">ChatGPT 也可能会犯错。请检查重要信息。</div>
      </div>
    </div>
  )
}

