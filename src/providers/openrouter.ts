import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { BaseClient } from './base';

/**
 * OpenRouter 模型客户端实现
 */
export class OpenRouterClient extends BaseClient {
  private openrouter: any;

  /**
   * 创建 OpenRouter 客户端
   * @param config 配置信息
   */
  constructor(config: Record<string, any>) {
    super(config);
    this.openrouter = createOpenRouter({
      baseURL: this.endpoint,
      apiKey: this.apiKey
    });
  }

  /**
   * 获取模型实例
   * @returns OpenRouter模型实例
   */
  protected _getModel(): any {
    return this.openrouter(this.model);
  }
}
