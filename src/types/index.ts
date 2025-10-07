export interface Prompt {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image';
  sender: 'user' | 'assistant';
  timestamp: Date;
  promptUsed?: string;
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export type InputType = 'text' | 'image';

export interface ApiResponse {
  success: boolean;
  data?: string;
  error?: string;
}