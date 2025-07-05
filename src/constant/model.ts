/**
 * 默认模型设置
 */
export const DEFAULT_MODEL_SETTINGS = {
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 8192
};

/**
 * 支持的提供商类型
 */
export enum ProviderType {
  OPENAI = 'openai',
  OLLAMA = 'ollama',
  ZHIPU = 'zhipu',
  OPENROUTER = 'openrouter',
  SILICONFLOW = 'siliconflow',
  DEEPSEEK = 'deepseek'
}
