import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Telegram Bot Setup
const token = process.env.BOT_TOKEN;
let webAppUrl = process.env.WEB_APP_URL || 'https://your-railway-app-url.up.railway.app';

// Ensure URL starts with https://
if (webAppUrl && !webAppUrl.startsWith('https://') && !webAppUrl.startsWith('http://')) {
  webAppUrl = 'https://' + webAppUrl;
}

if (token) {
  const bot = new TelegramBot(token, { polling: true });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
      await bot.sendMessage(chatId, 'Добро пожаловать в Metro Portal! 🚇\nНажмите на кнопку ниже, чтобы открыть приложение.', {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🚇 Открыть приложение', web_app: { url: webAppUrl } }]
          ]
        }
      });
    }
  });
  console.log('Telegram Bot started...');
} else {
  console.warn('BOT_TOKEN not provided, bot will not start.');
}

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
