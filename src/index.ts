/**
 * LLM API 统一调用工具类
 * 支持多种模型提供商：OpenAI、Ollama、智谱AI等
 * 支持普通输出和流式输出
 */
import { DEFAULT_MODEL_SETTINGS, ProviderType } from './constant/model';
import { extractThinkChain, extractAnswer } from './utils/llm-output';
import { LLMClientConfig, Message, ChatOptions } from './types';
import { OllamaClient } from './providers/ollama';
import { OpenAIClient } from './providers/openai';
import { ZhiPuClient } from './providers/zhipu';
import { OpenRouterClient } from './providers/openrouter';
import { BaseClient } from './providers/base';

/**
 * 统一的 LLM 客户端类
 * 根据配置选择不同的提供商客户端实现
 */
export class LLMClient {
  private config: Record<string, any>;
  private client: BaseClient;

  /**
   * 创建 LLM 客户端实例
   * @param config - 配置信息
   */
  constructor(config: LLMClientConfig = {}) {
    this.config = {
      provider: config.providerId || ProviderType.OPENAI,
      endpoint: this._handleEndpoint(config.providerId, config.endpoint) || '',
      apiKey: config.apiKey || '',
      model: config.modelName || '',
      temperature: config.temperature || DEFAULT_MODEL_SETTINGS.temperature,
      maxTokens: config.maxTokens || DEFAULT_MODEL_SETTINGS.maxTokens,
      max_tokens: config.maxTokens || DEFAULT_MODEL_SETTINGS.maxTokens
    };
    
    if (config.topP !== undefined && config.topP !== null) {
      this.config.topP = config.topP;
    }
    
    if (config.topK !== undefined && config.topK !== null) {
      this.config.topK = config.topK;
    }

    this.client = this._createClient(this.config.provider, this.config);
  }

  /**
   * 兼容之前版本的用户配置
   * @param provider - 提供商ID
   * @param endpoint - API端点
   * @returns 处理后的API端点
   */
  private _handleEndpoint(provider?: string, endpoint?: string): string | undefined {
    if (!endpoint) return endpoint;
    
    if (provider?.toLowerCase() === 'ollama') {
      if (endpoint.endsWith('v1/') || endpoint.endsWith('v1')) {
        return endpoint.replace('v1', 'api');
      }
    }
    
    if (endpoint.includes('/chat/completions')) {
      return endpoint.replace('/chat/completions', '');
    }
    
    return endpoint;
  }

  /**
   * 根据提供商创建对应的客户端实例
   * @param provider - 提供商ID
   * @param config - 配置信息
   * @returns 客户端实例
   */
  private _createClient(provider: string, config: Record<string, any>): BaseClient {
    const clientMap: Record<string, any> = {
      [ProviderType.OLLAMA]: OllamaClient,
      [ProviderType.OPENAI]: OpenAIClient,
      [ProviderType.SILICONFLOW]: OpenAIClient,
      [ProviderType.DEEPSEEK]: OpenAIClient,
      [ProviderType.ZHIPU]: ZhiPuClient,
      [ProviderType.OPENROUTER]: OpenRouterClient
    };
    
    const ClientClass = clientMap[provider.toLowerCase()] || OpenAIClient;
    return new ClientClass(config);
  }

  /**
   * 调用客户端方法的通用封装
   * @param method - 方法名
   * @param args - 方法参数
   * @returns 方法执行结果
   */
  private async _callClientMethod(method: string, ...args: any[]): Promise<any> {
    try {
      return await (this.client as any)[method](...args);
    } catch (error) {
      console.error(`${this.config.provider} API 调用出错:`, error);
      throw error;
    }
  }

  /**
   * 生成对话响应
   * @param prompt - 用户输入的提示词或对话历史
   * @param options - 可选参数
   * @returns 返回模型响应
   */
  async chat(prompt: string | Message[], options: ChatOptions = {}): Promise<string> {
    const messages = Array.isArray(prompt) ? prompt : [{ role: 'user', content: prompt }];
    options = {
      ...options,
      ...this.config
    };
    return this._callClientMethod('chat', messages, options);
  }

  /**
   * 流式生成对话响应
   * @param prompt - 用户输入的提示词或对话历史
   * @param options - 可选参数
   * @returns 返回可读流
   */
  async chatStream(prompt: string | Message[], options: ChatOptions = {}): Promise<Response> {
    const messages = Array.isArray(prompt) ? prompt : [{ role: 'user', content: prompt }];
    options = {
      ...options,
      ...this.config
    };
    return this._callClientMethod('chatStream', messages, options);
  }

  /**
   * 纯API流式生成对话响应
   * @param prompt - 用户输入的提示词或对话历史
   * @param options - 可选参数
   * @returns 返回原生Response对象
   */
  async chatStreamAPI(prompt: string | Message[], options: ChatOptions = {}): Promise<Response> {
    const messages = Array.isArray(prompt) ? prompt : [{ role: 'user', content: prompt }];
    options = {
      ...options,
      ...this.config
    };
    return this._callClientMethod('chatStreamAPI', messages, options);
  }

  /**
   * 获取模型响应
   * @param prompt - 提示词或对话历史
   * @param options - 可选参数
   * @returns 模型响应文本
   */
  async getResponse(prompt: string | Message[], options: ChatOptions = {}): Promise<string> {
    const llmRes: any = await this.chat(prompt, options);
    return llmRes.text || llmRes.response?.messages || '';
  }

  /**
   * 获取带有思维链的模型响应
   * @param prompt - 提示词或对话历史
   * @param options - 可选参数
   * @returns 包含回答和思维链的对象
   */
  async getResponseWithCOT(prompt: string | Message[], options: ChatOptions = {}): Promise<{ answer: string, cot: string }> {
    const llmRes: any = await this.chat(prompt, options);
    let answer = llmRes.text || '';
    let cot = llmRes.reasoning || '';
    
    if ((answer && answer.startsWith('<think>')) || answer.startsWith('<thinking>')) {
      cot = extractThinkChain(answer);
      answer = extractAnswer(answer);
    } else if (
      llmRes?.response?.body?.choices?.length > 0 &&
      llmRes.response.body.choices[0].message.reasoning_content
    ) {
      if (llmRes.response.body.choices[0].message.reasoning_content) {
        cot = llmRes.response.body.choices[0].message.reasoning_content;
      }
      if (llmRes.response.body.choices[0].message.content) {
        answer = llmRes.response.body.choices[0].message.content;
      }
    }
    
    if (answer.startsWith('\n\n')) {
      answer = answer.slice(2);
    }
    
    if (cot.endsWith('\n\n')) {
      cot = cot.slice(0, -2);
    }
    
    return { answer, cot };
  }
}

export { Message, ChatOptions, LLMClientConfig, ProviderType, DEFAULT_MODEL_SETTINGS };
export { extractJsonFromLLMOutput, extractThinkChain, extractAnswer } from './utils/llm-output';
