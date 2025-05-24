const { Connection, PublicKey } = require('@solana/web3.js');
const TelegramBot = require('node-telegram-bot-api');

// ENV
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;

const connection = new Connection('https://api.mainnet-beta.solana.com');
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

let lastSignature = null;

async function checkNewTx() {
  try {
    const pubKey = new PublicKey(WALLET_ADDRESS);
    const confirmed = await connection.getSignaturesForAddress(pubKey, { limit: 1 });

    if (!confirmed.length) return;

    const signature = confirmed[0].signature;

    if (signature !== lastSignature) {
      lastSignature = signature;

      const txUrl = `https://solscan.io/tx/${signature}`;
      const message = `🚨 พบธุรกรรมใหม่จากกระเป๋าเป้าหมาย:\n\n🔗 ${txUrl}`;

      await bot.sendMessage(CHAT_ID, message);
      console.log('✅ ส่งแจ้งเตือนแล้ว:', signature);
    } else {
      console.log('ไม่มีธุรกรรมใหม่');
    }
  } catch (err) {
    console.error('เกิดข้อผิดพลาด:', err.message);
  }
}

// Check ทุก 20 วินาที
setInterval(checkNewTx, 20_000);
