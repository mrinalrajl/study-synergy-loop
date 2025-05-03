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

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });
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
    res.status(500).json({ error: 'Gemini API error', details: err?.toString() });
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Gemini proxy server running on http://localhost:${PORT}`);
});
