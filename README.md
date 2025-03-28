# Local Model Interface

A modern, user-friendly interface for interacting with local language models through Ollama. Built with Electron, React, and TypeScript.

This application runs through the command line using the prompt:
```bash
ollama run <model_name>
```

The interface provides a graphical front-end to manage and interact with your local Ollama models, while leveraging the power and flexibility of command-line operations under the hood.

## Features

- 🚀 Easy model selection and management
- ⚡ Real-time response tracking
- 💬 Clean chat interface
- 🎨 Modern, responsive design
- 🔄 Live response time indicators
- 🛑 Simple model start/stop controls
- 🤖 Automatic Ollama process management

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Ollama](https://ollama.ai/) installed on your system
- Models installed in the default Ollama location (`~/.ollama/models/`)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/anthonyz/Local_Model_Interface.git
cd Local_Model_Interface
```

2. Install dependencies:
```bash
npm install
```

3. To start the application, open Terminal and enter this command:
```bash
npm run electron:start
```

## Development

- Start the development server:
```bash
npm run dev
```

- Build the application:
```bash
npm run build
```

## Important Notes

- The application automatically manages the Ollama process
- No need to manually start/stop Ollama - the interface handles this for you
- Models must be installed in the default Ollama location
- Keep the development server running while using the application

## Tech Stack

- Electron
- React
- TypeScript
- Tailwind CSS
- Vite

## License

Copyright (c) 2025 Anthony Siarkiewicz. All rights reserved.

This project is protected under a custom license that prohibits commercial use without explicit permission. See the [LICENSE](LICENSE) file for details.

For commercial use inquiries, please contact the author. 