export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  protocol: string;
  parameters?: Record<string, any>;
}

export interface ModelResponse {
  content: string;
  error?: string;
  metadata?: {
    model: string;
    timestamp: number;
    tokens?: number;
  };
}

export interface ModelStatus {
  isRunning: boolean;
  isConnected: boolean;
  error?: string;
  currentModel?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  error?: string;
  metadata?: {
    model?: string;
    timestamp: number;
    tokens?: number;
  };
}

export interface ChatSession {
  id: string;
  name: string;
  modelId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface OllamaProtocol {
  listModels(): Promise<string[]>;
  start(model: string): Promise<void>;
  stop(): Promise<void>;
  generate(model: string, prompt: string): Promise<string>;
} 