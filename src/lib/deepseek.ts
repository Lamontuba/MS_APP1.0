// src/lib/deepseek.ts
import OpenAI from 'openai';

export async function queryDeepSeek(messages: any[]) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    // Log the API key (masked for security)
    console.log('API Key:', apiKey ? '***' : 'Missing');

    if (!apiKey) {
      console.error('DeepSeek API key is missing');
      throw new Error('DeepSeek API key is missing');
    }

    // Initialize the OpenAI client with DeepSeek's base URL
    const openai = new OpenAI({
      baseURL: 'https://api.deepseek.com', // DeepSeek API base URL
      apiKey: apiKey, // Your DeepSeek API key
    });

    // Log the request payload for debugging
    console.log('Request Payload:', JSON.stringify({ messages }, null, 2));

    // Call the DeepSeek API
    const completion = await openai.chat.completions.create({
      messages,
      model: 'deepseek-chat', // Use the DeepSeek model
    });

    // Log the API response for debugging
    console.log('DeepSeek API Response:', completion);

    // Return the AI response
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error in queryDeepSeek:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null,
    });
    throw new Error('Failed to fetch AI response');
  }
}