import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/gemini", async (req: express.Request, res: express.Response) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("Sending prompt to Gemini:", prompt);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Received response from Gemini");
    res.json({ text });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Gemini API error" });
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Gemini proxy server running on port ${PORT}`);
});