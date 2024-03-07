const axios = require('axios');

const OpenAI_API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const API_ENDPOINT = 'https://api.openai.com/v1/engines/davinci-codex/completions';

const generateDynamicText = async (topic) => {
  try {
    const response = await axios.post(API_ENDPOINT, {
      prompt: `Tell me about ${topic}`,
      max_tokens: 100,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OpenAI_API_KEY}`,
      },
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating dynamic text:', error.message);
    return 'Failed to generate dynamic text.';
  }
};

module.exports = { generateDynamicText };
