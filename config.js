require('dotenv').config();

module.exports = {
  botToken: process.env.TELEGRAM_BOT_TOKEN,
  chatId: process.env.TELEGRAM_CHAT_ID,
  watchedAddress: process.env.WATCHED_ADDRESS,
};
