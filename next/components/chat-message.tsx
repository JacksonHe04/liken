"use client"

type ChatMessageProps = {
  role: 'user' | 'assistant'
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-3xl rounded-lg px-4 py-2 ${role === 'user' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'}`}
      >
        {content}
      </div>
    </div>
  )
}