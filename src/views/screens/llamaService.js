import axios from 'axios';

export const callLlamaHF = async prompt => {
  console.error('Groq Chat Prompt:', prompt);
  try {
    const res = await axios.post('http://10.0.2.2:8000/chat', {
      prompt,
    });

    return res.data.response;
  } catch (err) {
    console.error('Groq Chat Error:', err.response?.data || err.message);
    return 'Error: Failed to get Groq response.';
  }
};
