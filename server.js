import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// AI Chat Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';
const SYSTEM_PROMPT = `
You are the official AI Support Assistant for Project SY, a Metro 2033 simulator server in Garry's Mod. 
Your ONLY purpose is to help players with server issues (donations, bugs, gameplay mechanics, rules).

STRICT RULES:
1. If a user asks about ANYTHING else (math, coding, general knowledge, other games, life advice), politely refuse and state you can only help with Project SY.
2. Be concise, polite, and helpful.
3. Use Russian language by default unless asked otherwise.
4. Do not mention you are an AI model from DeepSeek or OpenRouter. You are "Project SY Assistant".
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "tngtech/deepseek-r1t2-chimera:free",
        "messages": [
          { "role": "system", "content": SYSTEM_PROMPT },
          ...messages
        ]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to fetch AI response' });
  }
});

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
      await bot.sendMessage(chatId, 'Добро пожаловать в Project SY! 🚇\nНажмите на кнопку ниже, чтобы открыть приложение.', {
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
