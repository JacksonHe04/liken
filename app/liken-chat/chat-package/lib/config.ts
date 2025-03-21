export interface ChatConfig {
  apiKey: string;
  baseURL: string;
  model?: string;
  systemPrompt?: string;
}

let globalConfig: ChatConfig | null = null;

export function initChat(config: ChatConfig) {
  if (!config.apiKey) {
    throw new Error('API Key is required');
  }
  if (!config.baseURL) {
    throw new Error('Base URL is required');
  }
  globalConfig = {
    model: 'doubao-1.5-lite-32k-250115',
    systemPrompt: '你是人工智能助手',
    ...config
  };
}

export function getConfig(): ChatConfig {
  if (!globalConfig) {
    // 使用 NEXT_PUBLIC_ 前缀的环境变量
    const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    if (!apiKey || !baseURL) {
      throw new Error(
        'Chat not initialized. Please either call initChat or set NEXT_PUBLIC_API_KEY and NEXT_PUBLIC_BASE_URL environment variables'
      );
    }
    
    initChat({ apiKey, baseURL });
  }
  return globalConfig;
}