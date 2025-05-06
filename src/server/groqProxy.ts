import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';

dotenv.config();

const app = express();
// Configure CORS to accept requests from any origin during development
// In production, you should specify your Netlify domain
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://luminous-bonbon-8f850c.netlify.app'
    : '*',
  credentials: true
}));
app.use(express.json());

if (!process.env.GROQ_API_KEY) {
  console.error("GROQ_API_KEY is not set in .env file");
  process.exit(1);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/groq", async (req: express.Request, res: express.Response) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log("Sending prompt to Groq:", prompt);

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "compound-beta", // Updated to a supported model
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    console.log("Received response from Groq");
    res.json({ text: chatCompletion.choices[0].message.content });
  } catch (err) {
    console.error("Groq API Error:", err);
    res.status(500).json({ error: "Groq API error" });
  }
});

// Add a health check endpoint
app.get("/api/groq/health", (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Groq proxy server running on port ${PORT}`);
});