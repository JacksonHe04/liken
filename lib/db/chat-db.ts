import { openDB, DBSchema } from 'idb';
import { v4 } from 'uuid';

// 定义聊天消息接口
interface ChatMessage {
  id: string; // 消息唯一ID
  role: 'user' | 'assistant'; // 消息角色：用户或助手
  content: string; // 消息内容
  timestamp: number; // 消息时间戳
}

// 定义聊天会话接口
interface ChatSession {
  id: string; // 会话唯一ID
  messages: ChatMessage[]; // 会话中的消息列表
  createdAt: number; // 会话创建时间
  updatedAt: number; // 会话最后更新时间
}

// 定义数据库模式接口
interface ChatDBSchema extends DBSchema {
  sessions: {
    key: string; // 主键为会话ID
    value: ChatSession; // 存储的值为ChatSession对象
    indexes: { 'by-updated': number }; // 按更新时间建立索引
  };
}

// ChatDB类，用于管理聊天数据库
class ChatDB {
  private dbName = 'liken-chat'; // 数据库名称
  private version = 1; // 数据库版本

  // 初始化数据库
  async init() {
    return openDB<ChatDBSchema>(this.dbName, this.version, {
      upgrade(db) {
        // 创建sessions对象存储
        const store = db.createObjectStore('sessions', { keyPath: 'id' });
        // 创建按更新时间排序的索引
        store.createIndex('by-updated', 'updatedAt');
      },
    });
  }

  // 创建新会话
  async createSession(): Promise<string> {
    const db = await this.init();
    const id = v4(); // 生成唯一ID
    const session: ChatSession = {
      id,
      messages: [], // 初始化空消息列表
      createdAt: Date.now(), // 设置创建时间
      updatedAt: Date.now(), // 设置更新时间
    };
    await db.add('sessions', session);
    return id; // 返回新会话ID
  }

  // 向会话中添加消息
  async addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    const db = await this.init();
    const tx = db.transaction('sessions', 'readwrite');
    const store = tx.objectStore('sessions');
    
    const session = await store.get(sessionId);
    if (!session) throw new Error('Session not found');

    // 创建新消息对象
    const newMessage: ChatMessage = {
      ...message,
      id: v4(), // 生成消息ID
      timestamp: Date.now(), // 设置时间戳
    };

    session.messages.push(newMessage); // 将消息添加到会话中
    session.updatedAt = Date.now(); // 更新会话时间
    
    await store.put(session); // 保存更新后的会话
    await tx.done; // 等待事务完成
    
    return newMessage; // 返回新创建的消息
  }

  // 获取指定会话
  async getSession(sessionId: string) {
    const db = await this.init();
    return db.get('sessions', sessionId);
  }

  // 列出所有会话，按更新时间排序
  async listSessions(limit = 10) {
    const db = await this.init();
    const tx = db.transaction('sessions', 'readonly');
    const index = tx.store.index('by-updated');
    
    return index.getAll(null, limit); // 获取最新的limit个会话
  }

  // 删除指定会话
  async deleteSession(sessionId: string) {
    const db = await this.init();
    await db.delete('sessions', sessionId);
  }
}

// 导出ChatDB实例
export const chatDB = new ChatDB();