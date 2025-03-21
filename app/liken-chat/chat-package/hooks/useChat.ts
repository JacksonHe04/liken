import { useState } from 'react';
import { Message } from '../types/message';
import { createChatCompletion } from '../lib/api';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClear = () => {
    setMessages([]);
  };

  const handleSubmit = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const stream = await createChatCompletion([...messages, userMessage]);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { role: 'assistant', content: '' };

      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(5).trim();
            if (!data || data === '[DONE]') continue;

            try {
              const parsedData = JSON.parse(data);
              if (parsedData.done) break;

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
              console.error('Failed to parse response:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    handleClear,
    handleSubmit,
  };
}