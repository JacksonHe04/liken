import { openDB, DBSchema } from 'idb';
import { v4 } from 'uuid';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

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
    const id = v4();
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
      id: v4(),
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