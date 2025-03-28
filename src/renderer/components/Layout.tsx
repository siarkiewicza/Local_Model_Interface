import React from 'react';
import { ModelSelector } from './ModelSelector';
import { ModelStatus } from '../../shared/types/model';

interface LayoutProps {
  children: React.ReactNode;
  availableModels: string[];
  currentModel: string | undefined;
  status: ModelStatus;
  onModelSelect: (model: string) => void;
  onStart: () => void;
  onStop: () => void;
  isLoading: boolean;
  elapsedTime?: number;
  responseTime?: number | null;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  availableModels,
  currentModel,
  status,
  onModelSelect,
  onStart,
  onStop,
  isLoading,
  elapsedTime,
  responseTime,
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Local Model Interface</h1>
              {isLoading && (
                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                  Response time: {elapsedTime?.toFixed(1)}s
                </div>
              )}
              {!isLoading && responseTime !== null && responseTime !== undefined && (
                <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                  Response time: {responseTime.toFixed(1)}s
                </div>
              )}
            </div>
            <ModelSelector
              availableModels={availableModels}
              currentModel={currentModel}
              status={status}
              onModelSelect={onModelSelect}
              onStart={onStart}
              onStop={onStop}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}; 