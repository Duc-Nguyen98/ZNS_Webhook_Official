const express = require('express');
const path = require('path');
require('dotenv').config();

const { extractZaloData } = require('./utils/zalo');
const { sendToTelegram } = require('./utils/telegram');

const app = express();
const port = 3001;

// Views / static
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(express.json());

const messageQueue = [];
let isSending = false;

async function processQueue() {
  if (isSending || messageQueue.length === 0) return;
  isSending = true;

  const { data } = messageQueue.shift();
  await sendToTelegram(data);

  isSending = false;
  processQueue();
}

// ===== Webhook Zalo =====
app.post('/zalo-webhook', (req, res) => {
  console.log('📥 Webhook nhận:', req.body);

  if (req.body.event_name === 'user_received_message') {
    const filtered = extractZaloData(req.body);
    messageQueue.push({ data: filtered });
    processQueue();
  }

  res.status(200).send('OK');
});

// Fallback
app.use((req, res) => {
  res.status(200).render('coming_soon', {
    countdownDeadline: new Date('2025-08-28T23:59:59Z').toISOString()
  });
});

app.listen(port, () => {
  console.log(`✅ Server chạy tại http://localhost:${port}`);
});
