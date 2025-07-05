import { createZhipu } from 'zhipu-ai-provider';
import { BaseClient } from './base';

/**
 * 智谱 AI 模型客户端实现
 */
export class ZhiPuClient extends BaseClient {
  private zhipu: any;

  /**
   * 创建智谱 AI 客户端
   * @param config 配置信息
   */
  constructor(config: Record<string, any>) {
    super(config);
    this.zhipu = createZhipu({
      baseURL: this.endpoint,
      apiKey: this.apiKey
    });
  }

  /**
   * 获取模型实例
   * @returns 智谱模型实例
   */
  protected _getModel(): any {
    return this.zhipu(this.model);
  }
}
