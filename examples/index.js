const { LLMClient } = require('../dist/index');

// Create client
const client = new LLMClient({
    endpoint: '',
    apiKey: '',
    modelName: ''
});

/**
 * Test chat
 */
async function testChat() {
    console.log('=== Test chat ===');
    const response = await client.chat('Hello');
    console.log('Response:', response);
    console.log('=== Test chat complete ===\n');
}

/**
 * Test chat response
 */
async function testChatResponse() {
    console.log('=== Test chat response ===');
    const response = await client.getResponse('Hello');
    console.log('Response:', response);
    console.log('=== Test chat response complete ===\n');
}

/**
 * Test chain of thought
 */
async function testChainOfThought() {
    console.log('=== Test chain of thought ===');
    const question = '1+1';
    const res = await client.getResponseWithCOT(question);
    console.log('COT:', res.cot);
    console.log('Answer:', res.answer);
    console.log('=== Test chain of thought complete ===\n');
}

/**
 * Test streaming
 * @param {string} message - The message to send
 */
async function testStreaming(message = 'Hello') {
    console.log('=== Test streaming ===');
    console.log('Sending message:', message);

    try {
        // const stream = await client.chatStream(message);
        const stream = await client.chatStreamAPI(message);
        console.log('\n--- Start receiving streaming response ---');

        const reader = stream.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                console.log('\n--- Streaming response ended ---');
                break;
            }

            // Decode and output the current chunk
            const chunk = decoder.decode(value, { stream: true });
            process.stdout.write(chunk); // 实时输出
            fullResponse += chunk;
        }

        console.log('\n\nFull response content:');
        console.log(fullResponse);
        console.log('=== Test streaming complete ===\n');

    } catch (error) {
        console.error('Test streaming error:', error);
    }
}

// Execute tests
(async () => {
    // await testChat();
    // await testChatResponse();
    // await testChainOfThought();
    // await testStreaming('1+1');
})();