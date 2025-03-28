import { ModelConfig, ModelResponse, ModelStatus } from '../types/model';

export interface BaseProtocol {
  // Protocol identification
  readonly protocolId: string;
  readonly protocolName: string;
  readonly protocolVersion: string;

  // Model lifecycle management
  initialize(config: ModelConfig): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  getStatus(): Promise<ModelStatus>;

  // Model interaction
  generateResponse(prompt: string, context?: string): Promise<ModelResponse>;
  streamResponse(prompt: string, context?: string, onChunk?: (chunk: string) => void): Promise<ModelResponse>;

  // Model management
  listAvailableModels(): Promise<string[]>;
  loadModel(modelId: string): Promise<void>;
  unloadModel(): Promise<void>;

  // Error handling
  handleError(error: Error): ModelResponse;
} 