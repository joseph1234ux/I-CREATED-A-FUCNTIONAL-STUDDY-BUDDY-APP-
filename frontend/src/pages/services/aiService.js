import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

export const getAIResponse = async (userMessage) => {
  try {
    if (!API_KEY || API_KEY === '') {
      return `⚠️ OpenRouter API key is missing. Please add it to frontend/.env`;
    }

    const response = await axios({
      method: 'POST',
      url: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://studybuddy.app',
        'X-Title': 'StudyBuddy AI Tutor',
      },
      data: {
        model: 'openai/gpt-3.5-turbo', // Try this instead
        messages: [
          { 
            role: 'system', 
            content: 'You are an AI Study Assistant for Nigerian Computer Science students. Be helpful, clear, and educational.' 
          },
          { 
            role: 'user', 
            content: userMessage 
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI Error:', error);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      return `❌ Error: ${error.response.data?.error?.message || 'Unknown error'}`;
    }
    
    return 'Something went wrong. Please try again.';
  }
};