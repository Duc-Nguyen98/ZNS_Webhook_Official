const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/proxy/telegram', async (req, res) => {
  let body = req.body;

  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  }

  // 👉 Ưu tiên body, fallback sang query
  const token = body.token || req.query.token;
  const chat_id = body.chat_id || req.query.chat_id;
  const text = body.text || req.query.text;
  const parse_mode = body.parse_mode || req.query.parse_mode || 'Markdown';

  if (!token || !chat_id || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${token}/sendMessage`,
      { chat_id, text, parse_mode }
    );
    res.json({ ok: true, result: response.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = 8888;
app.listen(PORT, () => {
  console.log(`🚀 Proxy Telegram đang chạy tại http://localhost:${PORT}`);
});
