import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron', {
    ipcRenderer: {
      invoke: (channel: string, ...args: any[]) => {
        const validChannels = [
          'list-models',
          'start-model',
          'stop-model',
          'get-model-status',
          'send-message'
        ];
        if (validChannels.includes(channel)) {
          return ipcRenderer.invoke(channel, ...args);
        }
        throw new Error(`Invalid channel: ${channel}`);
      }
    }
  }
); 