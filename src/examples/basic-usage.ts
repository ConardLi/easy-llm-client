/**
 * 基本用法示例
 */
import { LLMClient, ProviderType } from '..';

// 创建一个OpenAI客户端
async function main() {
  // 替换为您的API密钥
  const apiKey = 'your-api-key';
  
  const client = new LLMClient({
    providerId: ProviderType.OPENAI,
    endpoint: 'https://api.openai.com/v1/',
    apiKey,
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2048
  });

  try {
    // 简单对话示例
    console.log('发送请求到 OpenAI...');
    const response = await client.chat('你好，请介绍一下自己');
    console.log('响应:', response);
  } catch (error) {
    console.error('调用出错:', error);
  }
}

// 执行主函数
// 注意：在实际环境中使用时，请根据您的运行环境调整这部分代码
main().catch(error => console.error(error));
