/**
 * 第三方库的类型声明
 */

// 定义OpenRouter SDK提供商模块
declare module '@openrouter/ai-sdk-provider' {
  export function createOpenRouter(config: { baseURL: string; apiKey: string }): any;
}

// 定义Ollama AI提供商模块
declare module 'ollama-ai-provider' {
  export function createOllama(config: { baseURL: string; apiKey: string }): any;
}

// 定义智谱AI提供商模块
declare module 'zhipu-ai-provider' {
  export function createZhipu(config: { baseURL: string; apiKey: string }): any;
}
