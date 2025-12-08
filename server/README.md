# Project SY API Server

Простой сервер для Steam авторизации.

## Установка

```bash
cd server
npm install
```

## Настройка

1. Создай файл `.env` в папке `server`:

```env
STEAM_API_KEY=твой_steam_api_key
FRONTEND_URL=http://localhost:3000
PORT=3001
```

2. Получи Steam API Key: https://steamcommunity.com/dev/apikey

## Запуск

```bash
npm start
```

Сервер запустится на `http://localhost:3001`

## Эндпоинты

- `GET /auth/steam` - Редирект на Steam авторизацию
- `GET /auth/steam/callback` - Callback после авторизации
- `GET /api/user/:steamId` - Получить данные пользователя
