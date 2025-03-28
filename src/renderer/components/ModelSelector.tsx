import React from 'react';
import { ModelStatus } from '../../shared/types/model';

interface ModelSelectorProps {
  availableModels: string[];
  currentModel?: string;
  status: ModelStatus;
  onModelSelect: (modelId: string) => void;
  onStart: () => void;
  onStop: () => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  availableModels,
  currentModel,
  status,
  onModelSelect,
  onStart,
  onStop,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Model Selection</h2>
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              status.isRunning ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-gray-300">
            {status.isRunning ? 'Running' : 'Stopped'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Model Selection */}
        <div>
          <select
            value={currentModel || ''}
            onChange={(e) => onModelSelect(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={status.isRunning}
          >
            <option value="">Select a model</option>
            {availableModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={onStart}
            disabled={!currentModel || status.isRunning}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start Model
          </button>
          <button
            onClick={onStop}
            disabled={!status.isRunning}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Stop Model
          </button>
        </div>

        {/* Status information */}
        {status.error && (
          <div className="text-sm text-red-400">{status.error}</div>
        )}
      </div>
    </div>
  );
}; 