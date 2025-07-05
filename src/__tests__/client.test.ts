import { LLMClient } from '../index';
import { ProviderType } from '../constant/model';

// 这只是一个测试框架示例，实际运行需要有效的API密钥

describe('LLMClient', () => {
  // 模拟测试，不实际调用API
  it('should initialize with OpenAI provider', () => {
    const client = new LLMClient({
      providerId: ProviderType.OPENAI,
      endpoint: 'https://api.openai.com/v1/',
      apiKey: 'test-key',
      modelName: 'gpt-3.5-turbo'
    });

    // 测试客户端创建是否成功
    expect(client).toBeInstanceOf(LLMClient);
  });

  // 测试Ollama客户端初始化
  it('should initialize with Ollama provider', () => {
    const client = new LLMClient({
      providerId: ProviderType.OLLAMA,
      endpoint: 'http://localhost:11434',
      modelName: 'llama2'
    });

    expect(client).toBeInstanceOf(LLMClient);
  });

  // 更多测试可以添加在这里
});
