/**
 * LLM 输出处理工具函数
 */

/**
 * 从 LLM 输出中提取 JSON
 * @param output LLM 输出的文本
 * @returns 解析后的JSON对象，解析失败则返回undefined
 */
export function extractJsonFromLLMOutput(output: string): any {
  console.log('LLM 输出:', output);
  if (output.trim().startsWith('<think')) {
    output = extractAnswer(output);
  }
  try {
    const json = JSON.parse(output);
    return json;
  } catch {}
  const jsonStart = output.indexOf('```json');
  const jsonEnd = output.lastIndexOf('```');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    const jsonString = output.substring(jsonStart + 7, jsonEnd);
    try {
      const json = JSON.parse(jsonString);
      return json;
    } catch (error) {
      console.error('解析 JSON 时出错:', { error, llmResponse: output });
    }
  } else {
    console.error('模型未按标准格式输出:', output);
    return undefined;
  }
}

/**
 * 从输出中提取思维链内容
 * @param text LLM 输出的文本
 * @returns 思维链内容，未找到则返回空字符串
 */
export function extractThinkChain(text: string): string {
  const startTags = ['<think>', '<thinking>'];
  const endTags = ['</think>', '</thinking>'];
  let startIndex = -1;
  let endIndex = -1;
  let usedStartTag = '';
  let usedEndTag = '';

  for (let i = 0; i < startTags.length; i++) {
    const currentStartIndex = text.indexOf(startTags[i]);
    if (currentStartIndex !== -1) {
      startIndex = currentStartIndex;
      usedStartTag = startTags[i];
      usedEndTag = endTags[i];
      break;
    }
  }

  if (startIndex === -1) {
    return '';
  }

  endIndex = text.indexOf(usedEndTag, startIndex + usedStartTag.length);

  if (endIndex === -1) {
    return '';
  }

  return text.slice(startIndex + usedStartTag.length, endIndex).trim();
}

/**
 * 从文本中提取答案（排除思维链部分）
 * @param text LLM 输出的文本
 * @returns 排除思维链后的文本
 */
export function extractAnswer(text: string): string {
  const startTags = ['<think>', '<thinking>'];
  const endTags = ['</think>', '</thinking>'];
  for (let i = 0; i < startTags.length; i++) {
    const start = startTags[i];
    const end = endTags[i];
    if (text.includes(start) && text.includes(end)) {
      const partsBefore = text.split(start);
      const partsAfter = partsBefore[1].split(end);
      return (partsBefore[0].trim() + ' ' + partsAfter[1].trim()).trim();
    }
  }
  return text;
}
