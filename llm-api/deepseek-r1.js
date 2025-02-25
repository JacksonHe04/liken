import 'dotenv/config';
import OpenAI from 'openai';
import readline from 'readline';

const openai = new OpenAI({
  apiKey: process.env['ARK_API_KEY'],
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('----- 你可以开始提问了 -----');
  while (true) {
    const userMessage = await askQuestion('你: ');

    if (userMessage.toLowerCase() === 'exit') {
      console.log('----- 退出对话 -----');
      rl.close();
      break;
    }

    console.log('----- streaming request -----');
    const stream = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: '你是人工智能助手' },
        { role: 'user', content: userMessage },
      ],
      model: 'deepseek-r1-250120',
      stream: true,
    });

    for await (const part of stream) {
      process.stdout.write(part.choices[0]?.delta?.content || '');
    }
    process.stdout.write('\n');
  }
}

main();