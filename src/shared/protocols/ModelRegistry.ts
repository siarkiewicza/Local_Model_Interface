import { BaseProtocol } from './BaseProtocol';
import { OllamaProtocol } from './OllamaProtocol';
import { ModelConfig, ModelStatus, ModelResponse } from '../types/model';

export class ModelRegistry {
  private static instance: ModelRegistry;
  private protocols: Map<string, BaseProtocol> = new Map();

  private constructor() {
    // Register default protocols
    this.registerProtocol(new OllamaProtocol());
  }

  static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  registerProtocol(protocol: BaseProtocol): void {
    this.protocols.set(protocol.protocolId, protocol);
  }

  getProtocol(protocolId: string): BaseProtocol | undefined {
    return this.protocols.get(protocolId);
  }

  async initializeModel(config: ModelConfig): Promise<void> {
    const protocol = this.getProtocol(config.protocol);
    if (!protocol) {
      throw new Error(`Protocol ${config.protocol} not found`);
    }

    await protocol.initialize(config);
  }

  async startModel(config: ModelConfig): Promise<void> {
    const protocol = this.getProtocol(config.protocol);
    if (!protocol) {
      throw new Error(`Protocol ${config.protocol} not found`);
    }

    await protocol.start();
  }

  async stopModel(config: ModelConfig): Promise<void> {
    const protocol = this.getProtocol(config.protocol);
    if (!protocol) {
      throw new Error(`Protocol ${config.protocol} not found`);
    }

    await protocol.stop();
  }

  async getModelStatus(config: ModelConfig): Promise<ModelStatus> {
    const protocol = this.getProtocol(config.protocol);
    if (!protocol) {
      throw new Error(`Protocol ${config.protocol} not found`);
    }

    return protocol.getStatus();
  }

  async generateResponse(config: ModelConfig, prompt: string, context?: string): Promise<ModelResponse> {
    const protocol = this.getProtocol(config.protocol);
    if (!protocol) {
      throw new Error(`Protocol ${config.protocol} not found`);
    }

    return protocol.generateResponse(prompt, context);
  }

  async streamResponse(
    config: ModelConfig,
    prompt: string,
    context?: string,
    onChunk?: (chunk: string) => void
  ): Promise<ModelResponse> {
    const protocol = this.getProtocol(config.protocol);
    if (!protocol) {
      throw new Error(`Protocol ${config.protocol} not found`);
    }

    return protocol.streamResponse(prompt, context, onChunk);
  }

  async listAvailableModels(config: ModelConfig): Promise<string[]> {
    const protocol = this.getProtocol(config.protocol);
    if (!protocol) {
      throw new Error(`Protocol ${config.protocol} not found`);
    }

    return protocol.listAvailableModels();
  }

  async loadModel(config: ModelConfig, modelId: string): Promise<void> {
    const protocol = this.getProtocol(config.protocol);
    if (!protocol) {
      throw new Error(`Protocol ${config.protocol} not found`);
    }

    await protocol.loadModel(modelId);
  }

  async unloadModel(config: ModelConfig): Promise<void> {
    const protocol = this.getProtocol(config.protocol);
    if (!protocol) {
      throw new Error(`Protocol ${config.protocol} not found`);
    }

    await protocol.unloadModel();
  }
} 