const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { text, source_lang, target_lang } = req.body;
    
    try {
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a professional translator. Translate the given text accurately." },
          { role: "user", content: `Translate the following text from ${source_lang} to ${target_lang}: "${text}"` }
        ]
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.VERCEL_URL || 'https://your-site.com',
          'X-Title': 'Translation Service'
        }
      });
      
      const translation = response.data.choices[0].message.content;
      res.status(200).json({ translation });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};