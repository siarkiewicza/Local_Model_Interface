import { ModelStatus, Message } from '../../shared/types/model';

class IPCService {
  private static instance: IPCService;

  private constructor() {}

  static getInstance(): IPCService {
    if (!IPCService.instance) {
      IPCService.instance = new IPCService();
    }
    return IPCService.instance;
  }

  async listModels(): Promise<string[]> {
    return window.electron.ipcRenderer.invoke('list-models');
  }

  async startModel(modelId: string): Promise<ModelStatus> {
    return window.electron.ipcRenderer.invoke('start-model', modelId);
  }

  async stopModel(): Promise<ModelStatus> {
    return window.electron.ipcRenderer.invoke('stop-model');
  }

  async getModelStatus(): Promise<ModelStatus> {
    try {
      return await window.electron.ipcRenderer.invoke('get-model-status');
    } catch (error) {
      console.error('Failed to get model status:', error);
      return {
        isRunning: false,
        isConnected: false,
        error: 'Failed to get model status',
      };
    }
  }

  async sendMessage(content: string): Promise<Message> {
    const response = await window.electron.ipcRenderer.invoke('send-message', content);
    
    if (response.error) {
      return {
        role: 'assistant',
        content: 'Failed to get response from model',
        error: response.error,
        metadata: {
          timestamp: Date.now(),
        },
      };
    }

    return {
      role: 'assistant',
      content: response.content,
      metadata: {
        timestamp: Date.now(),
      },
    };
  }
}

export const ipcService = IPCService.getInstance(); 