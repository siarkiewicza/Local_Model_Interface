// Suppress TextInput warnings
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
process.env.ELECTRON_NO_ATTACH_CONSOLE = 'true';

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { ModelRegistry } from '../shared/protocols/ModelRegistry';
import { ModelConfig } from '../shared/types/model';

let mainWindow: BrowserWindow | null = null;
let currentModel: string | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Initialize model registry
const modelRegistry = ModelRegistry.getInstance();

// IPC handlers
ipcMain.handle('list-models', async () => {
  console.log('Listing available models...');
  const config: ModelConfig = {
    id: 'ollama',
    name: 'Ollama',
    description: 'Local Ollama models',
    protocol: 'ollama',
    parameters: {},
  };
  try {
    const models = await modelRegistry.listAvailableModels(config);
    console.log('Available models:', models);
    return models;
  } catch (error) {
    console.error('Failed to list models:', error);
    return [];
  }
});

ipcMain.handle('start-model', async (_, modelId: string) => {
  console.log(`Starting model: ${modelId}`);
  const config: ModelConfig = {
    id: 'ollama',
    name: 'Ollama',
    description: 'Local Ollama models',
    protocol: 'ollama',
    parameters: {},
  };
  try {
    // If a model is already running, stop it first
    if (currentModel) {
      await modelRegistry.stopModel(config);
    }

    console.log('Initializing model...');
    await modelRegistry.initializeModel(config);
    
    console.log('Loading model...');
    await modelRegistry.loadModel(config, modelId);
    
    console.log('Starting model...');
    await modelRegistry.startModel(config);
    
    currentModel = modelId;
    const status = await modelRegistry.getModelStatus(config);
    console.log('Model status:', status);
    return status;
  } catch (error) {
    console.error('Failed to start model:', error);
    currentModel = null;
    return {
      isRunning: false,
      isConnected: false,
      error: `Failed to start model: ${error}`,
    };
  }
});

ipcMain.handle('stop-model', async () => {
  console.log('Stopping model...');
  const config: ModelConfig = {
    id: 'ollama',
    name: 'Ollama',
    description: 'Local Ollama models',
    protocol: 'ollama',
    parameters: {},
  };
  try {
    await modelRegistry.stopModel(config);
    currentModel = null;
    const status = await modelRegistry.getModelStatus(config);
    console.log('Model stopped. Status:', status);
    return status;
  } catch (error) {
    console.error('Failed to stop model:', error);
    return {
      isRunning: false,
      isConnected: false,
      error: `Failed to stop model: ${error}`,
    };
  }
});

ipcMain.handle('get-model-status', async () => {
  const config: ModelConfig = {
    id: 'ollama',
    name: 'Ollama',
    description: 'Local Ollama models',
    protocol: 'ollama',
    parameters: {},
  };
  try {
    const status = await modelRegistry.getModelStatus(config);
    console.log('Current model status:', status);
    return status;
  } catch (error) {
    console.error('Failed to get model status:', error);
    return {
      isRunning: false,
      isConnected: false,
      error: `Failed to get model status: ${error}`,
    };
  }
});

ipcMain.handle('send-message', async (_, message: string) => {
  console.log('Sending message:', message);
  const config: ModelConfig = {
    id: 'ollama',
    name: 'Ollama',
    description: 'Local Ollama models',
    protocol: 'ollama',
    parameters: {},
  };
  try {
    if (!currentModel) {
      throw new Error('No model selected. Please select a model first.');
    }

    const status = await modelRegistry.getModelStatus(config);
    if (!status.isRunning) {
      throw new Error('Model is not running. Please start a model first.');
    }
    
    console.log('Generating response...');
    const response = await modelRegistry.generateResponse(config, message);
    console.log('Response received:', response);
    return response;
  } catch (error) {
    console.error('Failed to send message:', error);
    return {
      role: 'assistant',
      content: '',
      error: `Failed to send message: ${error}`,
      metadata: {
        timestamp: Date.now(),
      },
    };
  }
}); 