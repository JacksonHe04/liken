import { Message } from '../types/message';
import { getConfig } from './config';

export async function createChatCompletion(messages: Message[]): Promise<ReadableStream> {
  const config = getConfig();
  
  const response = await fetch(`${config.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: config.systemPrompt },
        ...messages,
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  if (!response.body) {
    throw new Error('Response body is null');
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      const reader = response.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
            controller.close();
            break;
          }
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              try {
                const parsed = JSON.parse(data);
                const text = parsed.choices?.[0]?.delta?.content || '';
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              } catch (e) {
                // 忽略无效的 JSON
              }
            }
          }
        }
      } catch (error) {
        controller.error(error);
      }
    }
  });
}