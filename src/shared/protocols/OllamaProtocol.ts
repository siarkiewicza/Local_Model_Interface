import { BaseProtocol } from './BaseProtocol';
import { ModelConfig, ModelResponse, ModelStatus } from '../types/model';

export class OllamaProtocol implements BaseProtocol {
  readonly protocolId = 'ollama';
  readonly protocolName = 'Ollama';
  readonly protocolVersion = '1.0.0';

  private config: ModelConfig | null = null;
  private baseUrl: string = 'http://localhost:11434';
  private currentModel: string | null = null;

  async initialize(config: ModelConfig): Promise<void> {
    this.config = config;
    this.baseUrl = config.parameters?.baseUrl || this.baseUrl;
  }

  async start(): Promise<void> {
    // Check if Ollama is running
    try {
      const response = await fetch(`${this.baseUrl}/api/version`);
      if (!response.ok) {
        throw new Error('Failed to connect to Ollama server');
      }
    } catch (error) {
      throw new Error('Ollama server is not running');
    }
  }

  async stop(): Promise<void> {
    if (!this.currentModel) {
      console.log('No model to stop');
      return;
    }

    try {
      // First try to kill the model process
      await this.killModel();

      // Then try to unload the model
      const unloadResponse = await fetch(`${this.baseUrl}/api/unload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: this.currentModel }),
      });

      if (!unloadResponse.ok) {
        // If we get a 404, it means the model is already unloaded
        if (unloadResponse.status === 404) {
          console.log('Model already unloaded');
        } else {
          console.warn('Failed to unload model:', await unloadResponse.text());
        }
      }

      // Always reset the current model, even if operations failed
      this.currentModel = null;
    } catch (error) {
      console.warn('Error during model stop:', error);
      // Still reset the current model even if there's an error
      this.currentModel = null;
    }
  }

  async getStatus(): Promise<ModelStatus> {
    try {
      // First check if Ollama server is running
      const response = await fetch(`${this.baseUrl}/api/version`);
      if (!response.ok) {
        return {
          isRunning: false,
          isConnected: false,
          error: 'Ollama server is not running',
        };
      }

      // If we have a current model, check if it's actually running
      if (this.currentModel) {
        const modelResponse = await fetch(`${this.baseUrl}/api/show`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: this.currentModel }),
        });

        if (!modelResponse.ok) {
          // If we can't find the model, it's not running
          this.currentModel = null;
          return {
            isRunning: false,
            isConnected: true,
            error: 'Model not found',
          };
        }
      }

      return {
        isRunning: !!this.currentModel,
        isConnected: true,
        currentModel: this.currentModel || undefined,
      };
    } catch (error) {
      return {
        isRunning: false,
        isConnected: false,
        error: 'Failed to connect to Ollama server',
      };
    }
  }

  async generateResponse(prompt: string, context?: string): Promise<ModelResponse> {
    if (!this.currentModel) {
      throw new Error('No model loaded');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.currentModel,
          prompt,
          context,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let fullResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(Boolean);
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              fullResponse += data.response;
            }
          } catch (error) {
            console.error('Error parsing JSON line:', line);
            throw new Error('Failed to parse model response');
          }
        }
      }

      return {
        content: fullResponse,
        metadata: {
          model: this.currentModel,
          timestamp: Date.now(),
        },
      };
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  async streamResponse(
    prompt: string,
    context?: string,
    onChunk?: (chunk: string) => void
  ): Promise<ModelResponse> {
    if (!this.currentModel) {
      throw new Error('No model loaded');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.currentModel,
          prompt,
          context,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      let fullResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(Boolean);
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              fullResponse += data.response;
              onChunk?.(data.response);
            }
          } catch (error) {
            console.error('Error parsing JSON line:', line);
            throw new Error('Failed to parse model response');
          }
        }
      }

      return {
        content: fullResponse,
        metadata: {
          model: this.currentModel,
          timestamp: Date.now(),
        },
      };
    } catch (error) {
      return this.handleError(error as Error);
    }
  }

  async listAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        throw new Error('Failed to list models');
      }

      const data = await response.json();
      return data.models.map((model: any) => model.name);
    } catch (error) {
      return [];
    }
  }

  async loadModel(modelId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/show`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: modelId }),
      });

      if (!response.ok) {
        throw new Error('Failed to load model');
      }

      this.currentModel = modelId;
    } catch (error) {
      throw new Error(`Failed to load model: ${(error as Error).message}`);
    }
  }

  async unloadModel(): Promise<void> {
    try {
      if (this.currentModel) {
        const response = await fetch(`${this.baseUrl}/api/unload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: this.currentModel }),
        });

        if (!response.ok) {
          throw new Error('Failed to unload model');
        }
      }
    } finally {
      this.currentModel = null;
    }
  }

  async killModel(): Promise<void> {
    if (!this.currentModel) {
      console.log('No model to kill');
      return;
    }

    try {
      // Try to kill the model process
      const killResponse = await fetch(`${this.baseUrl}/api/kill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: this.currentModel }),
      });

      if (!killResponse.ok) {
        console.warn('Failed to kill model:', await killResponse.text());
      }

      // Always reset the current model
      this.currentModel = null;
    } catch (error) {
      console.warn('Error killing model:', error);
      this.currentModel = null;
    }
  }

  handleError(error: Error): ModelResponse {
    return {
      content: '',
      error: error.message,
      metadata: {
        model: this.currentModel || 'unknown',
        timestamp: Date.now(),
      },
    };
  }
} 