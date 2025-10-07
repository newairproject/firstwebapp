import type { Prompt, Conversation } from '../types';

const STORAGE_KEYS = {
  PROMPTS: 'gpt-prompts',
  CONVERSATIONS: 'gpt-conversations',
  CURRENT_CONVERSATION: 'current-conversation-id',
};

// 프롬프트 관련 함수들
export const getPrompts = (): Prompt[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROMPTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading prompts:', error);
    return [];
  }
};

export const savePrompts = (prompts: Prompt[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROMPTS, JSON.stringify(prompts));
  } catch (error) {
    console.error('Error saving prompts:', error);
  }
};

export const addPrompt = (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Prompt => {
  const prompts = getPrompts();
  const newPrompt: Prompt = {
    ...prompt,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  prompts.push(newPrompt);
  savePrompts(prompts);
  return newPrompt;
};

export const updatePrompt = (id: string, updates: Partial<Pick<Prompt, 'name' | 'content'>>): void => {
  const prompts = getPrompts();
  const index = prompts.findIndex(p => p.id === id);
  if (index !== -1) {
    prompts[index] = {
      ...prompts[index],
      ...updates,
      updatedAt: new Date(),
    };
    savePrompts(prompts);
  }
};

export const deletePrompt = (id: string): void => {
  const prompts = getPrompts();
  const filtered = prompts.filter(p => p.id !== id);
  savePrompts(filtered);
};

// 대화 관련 함수들
export const getConversations = (): Conversation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (!stored) return [];
    const conversations = JSON.parse(stored);
    return conversations.map((conv: any) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error('Error loading conversations:', error);
    return [];
  }
};

export const saveConversations = (conversations: Conversation[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  } catch (error) {
    console.error('Error saving conversations:', error);
  }
};

export const getCurrentConversationId = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_CONVERSATION);
};

export const setCurrentConversationId = (id: string): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_CONVERSATION, id);
};

export const createNewConversation = (): Conversation => {
  const conversations = getConversations();
  const newConversation: Conversation = {
    id: crypto.randomUUID(),
    title: `대화 ${conversations.length + 1}`,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  conversations.unshift(newConversation);
  saveConversations(conversations);
  setCurrentConversationId(newConversation.id);
  return newConversation;
};

export const updateConversation = (id: string, updates: Partial<Conversation>): void => {
  const conversations = getConversations();
  const index = conversations.findIndex(c => c.id === id);
  if (index !== -1) {
    conversations[index] = {
      ...conversations[index],
      ...updates,
      updatedAt: new Date(),
    };
    saveConversations(conversations);
  }
};

export const deleteConversation = (id: string): void => {
  const conversations = getConversations();
  const filtered = conversations.filter(c => c.id !== id);
  saveConversations(filtered);
  
  // 현재 대화가 삭제된 경우 초기화
  if (getCurrentConversationId() === id) {
    if (filtered.length > 0) {
      setCurrentConversationId(filtered[0].id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CONVERSATION);
    }
  }
};