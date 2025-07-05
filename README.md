# Easy LLM Client

[![npm version](https://img.shields.io/npm/v/easy-llm-client.svg)](https://www.npmjs.com/package/easy-llm-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)

A unified TypeScript client for interacting with various Large Language Model (LLM) providers through a consistent API interface.

## Features

- **Provider Agnostic**: Single API to work with multiple LLM providers
- **Supported Providers**:
  - OpenAI
  - Ollama
  - ZhiPu AI
  - OpenRouter
  - SiliconFlow
  - DeepSeek
- **API Consistency**: Use the same interface regardless of the underlying provider
- **Streaming Support**: Stream responses for better UX and real-time feedback
- **Chain of Thought**: Extract intermediate reasoning steps from model outputs
- **Type Safe**: Full TypeScript support with proper type definitions

## Installation

```bash
npm install easy-llm-client
```

## Quick Start

### Basic Usage

```typescript
import { LLMClient, ProviderType } from 'easy-llm-client';

// Initialize a client with your preferred provider
const client = new LLMClient({
  providerId: ProviderType.OPENAI,  // Choose from available providers
  apiKey: 'your-api-key',
  endpoint: 'https://api.openai.com/v1/',
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7
});

// Simple chat completion
const response = await client.getResponse('Explain quantum computing in simple terms.');
console.log(response);

// Using messages for context
const messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'What is the capital of France?' }
];
const chatResponse = await client.chat(messages);
console.log(chatResponse);
```

### Streaming Responses

```typescript
import { LLMClient, ProviderType } from 'easy-llm-client';

const client = new LLMClient({
  providerId: ProviderType.OLLAMA,
  endpoint: 'http://localhost:11434',
  modelName: 'llama2'
});

// Get a streaming response
const stream = await client.chatStream('Write a short story about a robot learning to paint.');

// Process the stream using Web standard APIs
const reader = stream.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  // Process each chunk as it arrives
  const chunk = decoder.decode(value, { stream: true });
  console.log(chunk); // Real-time output
}
```

### Chain of Thought Extraction

```typescript
import { LLMClient, ProviderType } from 'easy-llm-client';

const client = new LLMClient({
  providerId: ProviderType.OPENAI,
  apiKey: 'your-api-key',
  modelName: 'gpt-4'
});

// Extract reasoning steps and final answer
const { cot, answer } = await client.getResponseWithCOT('Calculate 17 × 24 step by step.');

console.log('Reasoning:', cot);
console.log('Answer:', answer);
```

## Configuration Options

### Client Configuration

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| providerId | ProviderType | The LLM provider to use | OPENAI |
| endpoint | string | API endpoint URL | Provider-specific |
| apiKey | string | Authentication key | '' |
| modelName | string | Name of model to use | Provider-specific |

### Model Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| temperature | number | Sampling temperature | 0.7 |
| maxTokens | number | Maximum tokens to generate | 8192 |
| topP | number | Top-p sampling | 0.9 |
| topK | number | Top-k sampling | undefined |

## API Reference

### Client Methods

#### `chat(messages, options?)`

Send messages and get a complete response object with metadata.

#### `getResponse(prompt, options?)`

Send a prompt and get only the text response.

#### `chatStream(messages, options?)`

Send messages and get a streaming response using standard Web Stream API.

#### `chatStreamAPI(messages, options?)`

Low-level access to the streaming API.

#### `getResponseWithCOT(prompt, options?)`

Extract chain-of-thought reasoning and final answer from a response.

## Examples

See the [examples directory](https://github.com/ConardLi/easy-llm-client/tree/main/examples) for more usage examples.

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License
