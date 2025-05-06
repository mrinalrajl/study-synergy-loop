const { Groq } = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'https://luminous-bonbon-8f850c.netlify.app',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const body = JSON.parse(event.body);
    const { prompt } = body;
    
    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    console.log("Sending prompt to Groq:", prompt);

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "compound-beta",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    console.log("Received response from Groq");
    
    // Return the response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: chatCompletion.choices[0].message.content })
    };
  } catch (error) {
    console.error("Groq API Error:", error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Groq API error' })
    };
  }
};