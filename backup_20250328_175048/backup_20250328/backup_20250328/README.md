# Local Model Interface

A modern Electron-based desktop application for interacting with local AI models through Ollama. This interface provides a clean, user-friendly way to chat with various AI models while maintaining privacy by running everything locally.

> **Note**: This is the first iteration of the application, which requires terminal usage to launch. A second iteration will provide a standalone application version with a native installer.

## Features

- 🖥️ Modern, responsive desktop interface
- 🤖 Support for multiple local AI models through Ollama
- ⚡ Real-time response streaming
- ⏱️ Response time tracking and progress indicators
- 🔄 Manual model control (start/stop)
- 💬 Clean chat interface with message history
- 🌙 Dark mode by default
- 🔒 Privacy-focused (all processing happens locally)

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Ollama installed (but not necessarily running)
- At least one AI model installed via Ollama (e.g., llama2, deepseek-coder, etc.)

## Installation

1. Install Ollama and your desired models:
   ```bash
   # Install Ollama (if not already installed)
   # Follow instructions at https://ollama.ai/download

   # Install your desired model(s)
   ollama pull llama2
   # or
   ollama pull deepseek-coder
   ```

2. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/local-model-interface.git
   cd local-model-interface
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Development Usage

1. Start the development server:
   ```bash
   npm run dev
   ```

2. In a separate terminal, start the Electron application:
   ```bash
   npm run electron:start
   ```

3. In the application:
   - Select a model from the dropdown menu in the header (models must be installed in the default Ollama location)
   - Click "Start Model" to initialize the selected model (this will start the Ollama service if it's not running)
   - Type your message in the input field and press Enter or click Send
   - View the model's response in the chat interface
   - When finished, click "Stop Model" to free up system resources

## Important Notes

- This is the first iteration of the application, requiring terminal usage to launch
- The application assumes Ollama is installed but not necessarily running
- Models must be installed in the default Ollama location (typically `~/.ollama/models/`)
- The application will automatically detect models installed in the default location
- The application will handle starting and stopping the Ollama service as needed
- Keep the development server running while using the application

## Development

The project uses:
- Electron for the desktop application framework
- React for the user interface
- TypeScript for type safety
- Tailwind CSS for styling
- Vite for build tooling

### Project Structure

```
src/
├── main/           # Electron main process
├── renderer/       # React application
│   ├── components/ # React components
│   └── services/   # IPC and other services
└── shared/         # Shared types and protocols
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application
- `npm run electron:start` - Start the Electron application
- `npm run electron:build` - Build the Electron application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Ollama](https://ollama.ai/) for providing the local AI model infrastructure
- [Electron](https://www.electronjs.org/) for the desktop application framework
- [React](https://reactjs.org/) for the UI framework 