# 聊天记录本地持久化方案

## 1. 技术选择

- **IndexedDB**: 浏览器内置的低级API数据库
- **idb**: 简化IndexedDB操作的包装库
- **Zod**: 类型验证

## 2. 数据结构

```typescript
interface ChatMessage {
  id: string;          // UUID
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;   // 消息创建时间戳
}

interface ChatSession {
  id: string;          // UUID
  messages: ChatMessage[];
  createdAt: number;   // 会话创建时间戳
  updatedAt: number;   // 最后更新时间戳
}
```

## 3. 实现步骤

### 3.1 安装依赖

```bash
pnpm add idb zod uuidv4
```

### 3.2 创建数据库工具类

在 `lib/db` 目录下创建以下文件：

```typescript:/Users/jackson/WebstormProjects/liken/lib/db/chat-db.ts
import { openDB, DBSchema } from 'idb';
import { v4 as uuidv4 } from 'uuid';

interface ChatDBSchema extends DBSchema {
  sessions: {
    key: string;
    value: ChatSession;
    indexes: { 'by-updated': number };
  };
}

class ChatDB {
  private dbName = 'liken-chat';
  private version = 1;

  async init() {
    return openDB<ChatDBSchema>(this.dbName, this.version, {
      upgrade(db) {
        const store = db.createObjectStore('sessions', { keyPath: 'id' });
        store.createIndex('by-updated', 'updatedAt');
      },
    });
  }

  async createSession(): Promise<string> {
    const db = await this.init();
    const id = uuidv4();
    const session: ChatSession = {
      id,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await db.add('sessions', session);
    return id;
  }

  async addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    const db = await this.init();
    const tx = db.transaction('sessions', 'readwrite');
    const store = tx.objectStore('sessions');
    
    const session = await store.get(sessionId);
    if (!session) throw new Error('Session not found');

    const newMessage: ChatMessage = {
      ...message,
      id: uuidv4(),
      timestamp: Date.now(),
    };

    session.messages.push(newMessage);
    session.updatedAt = Date.now();
    
    await store.put(session);
    await tx.done;
    
    return newMessage;
  }

  async getSession(sessionId: string) {
    const db = await this.init();
    return db.get('sessions', sessionId);
  }

  async listSessions(limit = 10) {
    const db = await this.init();
    const tx = db.transaction('sessions', 'readonly');
    const index = tx.store.index('by-updated');
    
    return index.getAll(null, limit);
  }

  async deleteSession(sessionId: string) {
    const db = await this.init();
    await db.delete('sessions', sessionId);
  }
}

export const chatDB = new ChatDB();
```

### 3.3 创建React Context

```typescript:/Users/jackson/WebstormProjects/liken/contexts/chat-context.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { chatDB } from '@/lib/db/chat-db';

interface ChatContextType {
  currentSessionId: string | null;
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<void>;
  createNewSession: () => Promise<void>;
  switchSession: (sessionId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // 初始化时加载最近的会话
    const initSession = async () => {
      const sessions = await chatDB.listSessions(1);
      if (sessions.length > 0) {
        const session = sessions[0];
        setCurrentSessionId(session.id);
        setMessages(session.messages);
      } else {
        const newSessionId = await chatDB.createSession();
        setCurrentSessionId(newSessionId);
        setMessages([]);
      }
    };
    initSession();
  }, []);

  const addMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (!currentSessionId) return;
    const newMessage = await chatDB.addMessage(currentSessionId, message);
    setMessages(prev => [...prev, newMessage]);
  };

  const createNewSession = async () => {
    const newSessionId = await chatDB.createSession();
    setCurrentSessionId(newSessionId);
    setMessages([]);
  };

  const switchSession = async (sessionId: string) => {
    const session = await chatDB.getSession(sessionId);
    if (session) {
      setCurrentSessionId(session.id);
      setMessages(session.messages);
    }
  };

  return (
    <ChatContext.Provider value={{
      currentSessionId,
      messages,
      addMessage,
      createNewSession,
      switchSession,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
```

### 3.4 修改聊天组件

需要对 <mcfile name="chat-message.tsx" path="/Users/jackson/WebstormProjects/liken/components/chat-message.tsx"></mcfile> 进行以下修改：

1. 将组件包装在 ChatProvider 中
2. 使用 useChatContext 获取和存储消息

## 4. 使用示例

```typescript
import { useChatContext } from '@/contexts/chat-context';

function Chat() {
  const { messages, addMessage } = useChatContext();

  const handleSendMessage = async (content: string) => {
    await addMessage({
      role: 'user',
      content,
    });
    
    // 处理AI响应...
    await addMessage({
      role: 'assistant',
      content: '响应内容',
    });
  };

  return (
    <div>
      {messages.map(message => (
        <ChatMessage key={message.id} {...message} />
      ))}
    </div>
  );
}
```

## 5. 注意事项

1. **数据清理**: 定期清理过期的会话数据，避免占用过多存储空间
2. **错误处理**: 添加适当的错误处理机制，处理存储失败的情况
3. **数据迁移**: 在更新数据库结构时，需要处理版本迁移
4. **存储限制**: 注意浏览器对 IndexedDB 的存储限制（通常在几百MB左右）

## 6. 后续优化

1. 添加会话导出/导入功能
2. 实现消息搜索功能
3. 添加会话标签和分类
4. 实现云端同步功能