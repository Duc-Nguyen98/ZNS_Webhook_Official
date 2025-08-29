const axios = require('axios');

async function sendToTelegram(data) {
  const chatIds = process.env.CHAT_IDS?.split(',') || [];
  const token = process.env.TELEGRAM_TOKEN;

  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== null && v !== undefined)
  );

  cleanData.source = cleanData.phone ? "phone" : "user_id";

  const message = `📩 Zalo Webhook Data:\n` + JSON.stringify(cleanData, null, 2);

  const chunks = message.match(/[\s\S]{1,4000}/g) || [];
  for (const chatId of chatIds) {
    for (const chunk of chunks) {
      try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        await axios.post(url, { chat_id: chatId, text: chunk });
      } catch (err) {
        console.error("❌ Lỗi gửi Telegram:", err.response?.data || err.message);
      }
    }
  }
}

module.exports = { sendToTelegram };
