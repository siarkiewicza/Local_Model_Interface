import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import { Message, ModelStatus } from '../shared/types/model';
import { ipcService } from './services/ipcService';

export const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<ModelStatus>({
    isRunning: false,
    isConnected: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // Load available models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const models = await ipcService.listModels();
        setAvailableModels(models);
      } catch (err) {
        setError('Failed to load available models');
        console.error('Error loading models:', err);
      }
    };

    loadModels();
  }, []);

  // Handle timing updates
  useEffect(() => {
    if (isLoading && !startTimeRef.current) {
      startTimeRef.current = Date.now();
      setElapsedTime(0);
      // Update elapsed time every 100ms
      timerRef.current = window.setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
      }, 100);
    } else if (!isLoading && startTimeRef.current) {
      const endTime = Date.now();
      const timeElapsed = (endTime - startTimeRef.current) / 1000;
      setResponseTime(timeElapsed);
      startTimeRef.current = null;
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isLoading]);

  // Handle model selection
  const handleModelSelect = async (model: string) => {
    setCurrentModel(model);
    setError(null);
  };

  // Handle model start
  const handleStart = async () => {
    if (!currentModel) {
      setError('Please select a model first');
      return;
    }

    try {
      const newStatus = await ipcService.startModel(currentModel);
      setStatus(newStatus);
    } catch (err) {
      setStatus({
        isRunning: false,
        isConnected: false,
        error: 'Failed to start the model',
      });
      setError('Failed to start the model');
      console.error('Error starting model:', err);
    }
  };

  // Handle model stop
  const handleStop = async () => {
    try {
      const newStatus = await ipcService.stopModel();
      setStatus(newStatus);
    } catch (err) {
      setStatus({
        isRunning: false,
        isConnected: false,
        error: 'Failed to stop the model',
      });
      setError('Failed to stop the model');
      console.error('Error stopping model:', err);
    }
  };

  // Handle message sending
  const handleSendMessage = async (content: string) => {
    if (!currentModel) {
      setError('Please select a model first');
      return;
    }

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      role: 'user',
      content,
      metadata: {
        model: currentModel,
        timestamp: Date.now(),
      },
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await ipcService.sendMessage(content);
      setMessages(prev => [...prev, response]);
    } catch (err) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request.',
        error: err instanceof Error ? err.message : 'Unknown error occurred',
        metadata: {
          model: currentModel,
          timestamp: Date.now(),
        },
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      availableModels={availableModels}
      currentModel={currentModel}
      status={status}
      onModelSelect={handleModelSelect}
      onStart={handleStart}
      onStop={handleStop}
      isLoading={isLoading}
      elapsedTime={elapsedTime}
      responseTime={responseTime}
    >
      <ChatInterface
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </Layout>
  );
};

export default App; 