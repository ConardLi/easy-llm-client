/**
 * 流式输出示例
 */
import { LLMClient, ProviderType } from '..';

// 创建一个OpenAI客户端并使用流式输出
async function main() {
  // 替换为您的API密钥
  const apiKey = 'your-api-key';
  
  const client = new LLMClient({
    providerId: ProviderType.OPENAI,
    endpoint: 'https://api.openai.com/v1/',
    apiKey,
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7
  });

  try {
    console.log('发送流式请求到 OpenAI...');
    
    // 获取流式响应
    const stream = await client.chatStream('给我写一个关于人工智能的短文');
    
    // 处理流式输出
    const reader = stream.body?.getReader();
    const decoder = new TextDecoder();
    
    if (reader) {
      console.log('\n--- 开始接收流式响应 ---');
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // 解码并输出当前块
        const text = decoder.decode(value, { stream: true });
        console.log(text); // 在浏览器环境中，可以替换为适当的输出方式
      }
      console.log('\n--- 流式响应结束 ---');
    }
  } catch (error) {
    console.error('调用出错:', error);
  }
}

// 执行主函数
// 注意：在实际环境中使用时，请根据您的运行环境调整这部分代码
main().catch(error => console.error(error));
