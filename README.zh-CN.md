# Easy LLM Client

[![npm版本](https://img.shields.io/npm/v/easy-llm-client.svg)](https://www.npmjs.com/package/easy-llm-client)
[![许可证: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)

一个统一的TypeScript客户端，通过一致的API接口与各种大语言模型(LLM)提供商进行交互。

## 特性

- **提供商无关**: 单一API可与多个LLM提供商协同工作
- **支持的提供商**:
  - OpenAI
  - Ollama
  - 智谱AI
  - OpenRouter
  - SiliconFlow
  - DeepSeek
- **API一致性**: 无论底层提供商如何，使用相同的接口
- **流式响应**: 支持响应流式传输，提供更好的用户体验和实时反馈
- **思维链**: 从模型输出中提取中间推理步骤
- **类型安全**: 完整的TypeScript支持，提供适当的类型定义

## 安装

```bash
npm install easy-llm-client
```

## 快速开始

### 基本用法

```typescript
import { LLMClient, ProviderType } from 'easy-llm-client';

// 使用您首选的提供商初始化客户端
const client = new LLMClient({
  providerId: ProviderType.OPENAI,  // 从可用提供商中选择
  apiKey: '您的API密钥',
  endpoint: 'https://api.openai.com/v1/',
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7
});

// 简单的聊天完成
const response = await client.getResponse('用简单的术语解释量子计算。');
console.log(response);

// 使用消息提供上下文
const messages = [
  { role: 'system', content: '你是一个有帮助的助手。' },
  { role: 'user', content: '法国的首都是什么？' }
];
const chatResponse = await client.chat(messages);
console.log(chatResponse);
```

### 流式响应

```typescript
import { LLMClient, ProviderType } from 'easy-llm-client';

const client = new LLMClient({
  providerId: ProviderType.OLLAMA,
  endpoint: 'http://localhost:11434',
  modelName: 'llama2'
});

// 获取流式响应
const stream = await client.chatStream('写一个关于机器人学习绘画的短篇故事。');

// 使用Web标准API处理流
const reader = stream.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  // 处理每个到达的数据块
  const chunk = decoder.decode(value, { stream: true });
  console.log(chunk); // 实时输出
}
```

### 思维链提取

```typescript
import { LLMClient, ProviderType } from 'easy-llm-client';

const client = new LLMClient({
  providerId: ProviderType.OPENAI,
  apiKey: '您的API密钥',
  modelName: 'gpt-4'
});

// 提取推理步骤和最终答案
const { cot, answer } = await client.getResponseWithCOT('逐步计算17 × 24。');

console.log('推理过程:', cot);
console.log('答案:', answer);
```

## 配置选项

### 客户端配置

| 选项 | 类型 | 描述 | 默认值 |
|--------|------|-------------|---------|
| providerId | ProviderType | 要使用的LLM提供商 | OPENAI |
| endpoint | string | API端点URL | 提供商特定 |
| apiKey | string | 认证密钥 | '' |
| modelName | string | 要使用的模型名称 | 提供商特定 |

### 模型参数

| 参数 | 类型 | 描述 | 默认值 |
|-----------|------|-------------|---------|
| temperature | number | 采样温度 | 0.7 |
| maxTokens | number | 生成的最大令牌数 | 8192 |
| topP | number | Top-p采样 | 0.9 |
| topK | number | Top-k采样 | undefined |

## API参考

### 客户端方法

#### `chat(messages, options?)`

发送消息并获取带有元数据的完整响应对象。

#### `getResponse(prompt, options?)`

发送提示并仅获取文本响应。

#### `chatStream(messages, options?)`

发送消息并使用标准Web流API获取流式响应。

#### `chatStreamAPI(messages, options?)`

低级访问流式API。

#### `getResponseWithCOT(prompt, options?)`

从响应中提取思维链推理和最终答案。

## 示例

查看[示例目录](https://github.com/ConardLi/easy-llm-client/tree/main/examples)了解更多使用示例。

## 开发

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 运行测试
npm test
```

## 贡献

欢迎贡献！请随时提交Pull Request。

1. Fork仓库
2. 创建您的特性分支（`git checkout -b feature/amazing-feature`）
3. 提交您的更改（`git commit -m '添加一些惊人的特性'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 打开Pull Request

## 许可证

该项目采用MIT许可证
