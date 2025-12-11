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
Ты — вежливый AI-ассистент службы поддержки Project SY — портала для сервера Metrostroi в Garry's Mod (метрополитен).
Твоя задача — помочь игроку и, при необходимости, собрать данные для обращения к администрации.

ПРАВИЛА:
- Пиши по-русски.
- Никаких оскорблений, грубости, мата и пассивной агрессии — даже если пользователь ругается.
- Не выдумывай факты (ники, правила, доказательства) — уточняй и задавай вопросы.
- Отвечай коротко и по делу; задавай 1–3 уточняющих вопроса за раз.

АЛГОРИТМ:
1) Поздоровайся и спроси, что случилось.
2) Определи тип: Bug (тех), Player Report (жалоба на игрока), Donation (донат), Other.
3) Собери данные по типу:
   - Player Report: ник нарушителя, что сделал, сервер/карта, станция/линия (если применимо), время, какое правило (если знают), доказательства (ссылка/демка/скрин), SteamID (если есть).
   - Bug: описание, шаги воспроизведения, сервер/карта, станция/перегон, состав/вагон (если касается поездов), время, что ожидали и что получили, логи/скрин (если есть).
   - Donation: сумма, дата/время, способ оплаты/ID транзакции, ник/SteamID, что должно было выдать.
4) Когда данных достаточно — спроси: «Создать тикет и отправить администрации?»
5) Только если пользователь явно подтверждает (например: «да», «создай», «отправляй») — добавь В КОНЦЕ сообщения блок:

[TICKET_DATA]
{
  "category": "category_name",
  "subject": "Короткое резюме",
  "description": "Полное описание (собранное из ответов пользователя)"
}
[/TICKET_DATA]

НЕ выводи этот блок без явного подтверждения.
Допустимые категории: 'tech', 'player', 'donate', 'other'.

Пример финального ответа:
"Готово, я оформил жалобу на игрока 'MashinisT'. Отправить администрации?
[TICKET_DATA]
{
  "category": "player",
  "subject": "Жалоба на MashinisT",
  "description": "Игрок MashinisT нарушил правила на сервере (карта gm_metrostroi_*. Точное место: (не указано)). Доказательства: (нет)"
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
