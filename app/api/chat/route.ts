import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // 验证请求数据
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '无效的请求数据' },
        { status: 400 }
      );
    }

    // 创建流式响应
    const stream = await openai.chat.completions.create({
      // model: 'deepseek-r1-250120',
      model: 'doubao-1.5-lite-32k-250115',
      messages: [
        { role: 'system', content: '你是人工智能助手' },
        ...messages,
      ],
      stream: true,
    });

    // 返回流式响应
    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        for await (const part of stream) {
          const text = part.choices[0]?.delta?.content || '';
          const data = JSON.stringify({ text });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      },
    });

    return new NextResponse(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API错误:', error);
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
}