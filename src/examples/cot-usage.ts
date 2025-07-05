/**
 * 思维链(CoT)示例
 */
import { LLMClient, ProviderType } from '..';

// 使用思维链获取模型的推理过程
async function main() {
  // 替换为您的API密钥
  const apiKey = 'your-api-key';
  
  const client = new LLMClient({
    providerId: ProviderType.OPENAI,
    endpoint: 'https://api.openai.com/v1/',
    apiKey,
    modelName: 'gpt-3.5-turbo',
    temperature: 0.2 // 降低温度以获得更稳定的推理
  });

  try {
    console.log('发送带有思维链的请求...');
    
    // 一个需要推理的问题
    const prompt = '一个商店里苹果的价格是每个5元，梨子的价格是每个3元。如果我买了4个苹果和6个梨子，一共花了多少钱？';
    
    // 获取带思维链的响应
    const { answer, cot } = await client.getResponseWithCOT(prompt);
    
    console.log('\n思维过程:');
    console.log('-'.repeat(40));
    console.log(cot);
    console.log('-'.repeat(40));
    
    console.log('\n最终答案:', answer);
  } catch (error) {
    console.error('调用出错:', error);
  }
}

// 执行主函数
// 注意：在实际环境中使用时，请根据您的运行环境调整这部分代码
main().catch(error => console.error(error));
