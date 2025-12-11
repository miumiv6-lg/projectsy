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
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'mistralai/devstral-2512:free';
const OPENROUTER_HTTP_REFERER = process.env.OPENROUTER_HTTP_REFERER;
const OPENROUTER_APP_TITLE = process.env.OPENROUTER_APP_TITLE || 'Project SY';
const SYSTEM_PROMPT = `
You are the interactive AI Support Agent for Project SY, a Metro 2033 simulator server.
Your goal is to help players and, if necessary, gather information to create a support ticket.

ROLE:
- Act as a triage agent. Do not just answer questions; ask for details to solve the problem.
- Be concise, professional, and immersive (Metro 2033 style is optional but nice).
- Use Russian language by default.

PROTOCOL:
1. Greet the user and ask what happened.
2. Identify the issue type (Bug, Player Report, Donation, Other).
3. Ask SPECIFIC questions based on the type:
   - Player Report: Nickname of violator, Rule broken, Proof (link).
   - Bug: Description, Steps to reproduce.
   - Donation: Transaction ID, Amount, Date.
4. Once you have enough information, ask the user if they want to submit a ticket.
5. IF the user confirms (says "yes", "submit", "create"), you MUST output a special JSON block at the end of your message:
   
   [TICKET_DATA]
   {
     "category": "category_name",
     "subject": "Short summary",
     "description": "Full compiled description"
   }
   [/TICKET_DATA]

   DO NOT output this block unless the user explicitly confirms they want to submit.
   The categories are: 'tech', 'player', 'donate', 'other'.

Example of final response:
"Хорошо, я подготовил вашу жалобу на игрока 'Stalker123'. Отправляю администраторам?
[TICKET_DATA]
{
  "category": "player",
  "subject": "Жалоба на Stalker123",
  "description": "Игрок Stalker123 нарушил правило RDM на станции Полис. Доказательства: (нет)"
}
[/TICKET_DATA]"
`;

app.post('/api/chat', async (req, res) => {
  try {
    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: {
          message: 'OPENROUTER_API_KEY is not set on the server. Add it to the environment (.env / Railway Variables) and redeploy.'
        }
      });
    }

    const { messages } = req.body || {};

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: {
          message: 'Invalid request: `messages` must be an array'
        }
      });
    }

    const httpReferer =
      OPENROUTER_HTTP_REFERER ||
      process.env.WEB_APP_URL ||
      req.get('origin') ||
      req.get('referer') ||
      'https://example.com';

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": httpReferer,
        "X-Title": OPENROUTER_APP_TITLE,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": OPENROUTER_MODEL,
        "messages": [
          { "role": "system", "content": SYSTEM_PROMPT },
          ...messages
        ]
      })
    });

    const data = await response.json().catch(() => null);

    if (!data) {
      return res.status(502).json({
        error: {
          message: 'Upstream (OpenRouter) returned a non-JSON response'
        }
      });
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch AI response'
      }
    });
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
