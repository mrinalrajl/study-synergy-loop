
// Gemini Proxy API (Express)
// To use: npm install express cors @google/genai mime dotenv
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// The default API key to use if none is provided in the request
const DEFAULT_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDEx7VUf4MlLGb61AMVG302MjrqSgyGBBA";

app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
    
    // Get API key from request header or use default
    const apiKey = req.headers['x-api-key'] || DEFAULT_API_KEY;
    
    const ai = new GoogleGenAI({ apiKey });
    
    const config = { responseMimeType: 'text/plain' };
    const model = 'gemini-1.5-pro';
    const contents = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];
    
    const response = await ai.models.generateContentStream({ model, config, contents });
    let result = '';
    for await (const chunk of response) {
      result += chunk.text;
    }
    res.json({ text: result });
  } catch (err) {
    console.error('Gemini API error:', err);
    res.status(500).json({ error: 'Gemini API error', details: err?.toString() });
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Gemini proxy server running on http://localhost:${PORT}`);
});
