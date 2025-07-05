import { createOpenAI } from '@ai-sdk/openai';
import { BaseClient } from './base';

/**
 * OpenAI 模型客户端实现
 */
export class OpenAIClient extends BaseClient {
  private openai: any;

  /**
   * 创建 OpenAI 客户端
   * @param config 配置信息
   */
  constructor(config: Record<string, any>) {
    super(config);
    this.openai = createOpenAI({
      baseURL: this.endpoint,
      apiKey: this.apiKey
    });
  }

  /**
   * 获取模型实例
   * @returns OpenAI模型实例
   */
  protected _getModel(): any {
    return this.openai(this.model);
  }
}
