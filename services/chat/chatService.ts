import { Message } from '@/types/chat';

export interface ChatResponse {
  text?: string;
  done?: boolean;
}

export class ChatService {
  static async streamChat(messages: Message[]): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error('请求失败');
    }

    return response.body!;
  }

  static async* processStream(stream: ReadableStream<Uint8Array>): AsyncGenerator<ChatResponse, void, unknown> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
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
              yield parsedData;
            } catch (e) {
              console.error('处理响应数据失败:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}