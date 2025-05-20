const axios = require('axios');
const { botToken, chatId, watchedAddress } = require('./config');

const endpoint = `https://api.solana.fm/v0/address/${watchedAddress}/txs?limit=1&cluster=mainnet-beta`;

let lastTx = null;

async function checkTx() {
  try {
    const res = await axios.get(endpoint);
    const tx = res.data?.result?.[0];

    if (!tx || tx.signature === lastTx) return;

    lastTx = tx.signature;

    const message = `🧠 Wallet ซื้อเหรียญใหม่แล้ว!\n\n🔗 TX: https://solscan.io/tx/${tx.signature}`;
    await sendTelegramAlert(message);
  } catch (err) {
    console.error('Error fetching tx:', err.message);
  }
}

async function sendTelegramAlert(msg) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  await axios.post(url, {
    chat_id: chatId,
    text: msg,
    parse_mode: "Markdown"
  });
}

setInterval(checkTx, 10000); // เช็คทุก 10 วิ
