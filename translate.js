const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { text, target_lang } = req.body;
    
    if (!text || !target_lang) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', 
        {
          model: "mattshumer/reflection-70b:free",
          messages: [
            { role: "system", content: `You are a translator. Translate the following text to ${target_lang}.` },
            { role: "user", content: text }
          ]
        },
        {
          headers: {
            'Authorization': 'Bearer sk-or-v1-8e',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://your-app-url.com', // Replace with your actual app URL
            'X-Title': 'OpenRouter Translate Serverless' // Replace with your app name
          }
        }
      );

      const translation = response.data.choices[0].message.content;
      res.status(200).json({ translations: [{ text: translation }] });
    } catch (error) {
      res.status(500).json({ error: 'Translation failed', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
