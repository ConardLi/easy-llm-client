/**
 * LLM 相关类型定义
 */

import { ProviderType } from '../constant/model';

/**
 * 消息角色类型
 */
export type MessageRole = 'user' | 'assistant' | 'system' | 'function';

/**
 * 消息结构
 */
export interface Message {
  role: MessageRole;
  content: string;
  name?: string;
}

/**
 * LLM 客户端配置
 */
export interface LLMClientConfig {
  /** 提供商ID */
  providerId?: string;
  /** API 端点 */
  endpoint?: string;
  /** API 密钥 */
  apiKey?: string;
  /** 模型名称 */
  modelName?: string;
  /** 温度参数 */
  temperature?: number;
  /** 最大生成token数 */
  maxTokens?: number;
  /** top-p采样参数 */
  topP?: number;
  /** top-k采样参数 */
  topK?: number;
}

/**
 * 模型配置项
 */
export interface ModelConfig {
  temperature: number;
  top_p: number;
  max_tokens: number;
  top_k?: number;
}

/**
 * 对话选项
 */
export interface ChatOptions {
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  top_k?: number;
  [key: string]: any;
}

/**
 * 流式输出事件处理器
 */
export interface StreamCallbacks {
  onStart?: () => void;
  onToken?: (token: string) => void;
  onCompletion?: (completion: string) => void;
  onThinking?: (thinking: string) => void;
  onError?: (error: Error) => void;
  onEnd?: () => void;
}
