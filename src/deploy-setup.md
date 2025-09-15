# GRITHER - Deployment Setup Guide

## 🚀 Этапы развертывания

### Этап 1: Подготовка Frontend (ГОТОВО)
- ✅ React приложение готово
- ✅ Все компоненты работают
- ✅ Система уведомлений настроена
- ✅ Адаптивный дизайн

### Этап 2: Frontend Deployment (СЕЙЧАС)
```bash
# 1. Деплой на Vercel (рекомендуется)
npm install -g vercel
vercel --prod

# 2. Или на Netlify
npm run build
# Затем загрузить dist/ на netlify.com
```

### Этап 3: Telegram Bot Setup
```bash
# Создать бота через @BotFather
/newbot
# Имя: GRITHER Bot
# Username: grither_app_bot

# Получить Bot Token
# Настроить Web App URL после деплоя
/setmenubutton
```

### Этап 4: Backend Development
```
Backend Stack:
- Node.js + Express/Fastify
- PostgreSQL (или Supabase)
- Telegram Bot API
- JWT Authentication
```

### Этап 5: Database Schema
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  balance INTEGER DEFAULT 1000,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- И остальные таблицы для задач, достижений, баттлов...
```

### Этап 6: CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
```

## 🛠️ Immediate Next Steps

1. **Deploy Current Version**
   - Получить HTTPS URL
   - Настроить Telegram Web App

2. **Create Bot**
   - Получить Bot Token
   - Настроить команды

3. **Setup Database**
   - Создать Supabase проект
   - Настроить схему БД

4. **Backend API**
   - Создать API endpoints
   - Интегрировать с Telegram

5. **Real-time Updates**
   - WebSockets или Server-Sent Events
   - Синхронизация между пользователями

## 📱 Telegram Web App Integration

После деплоя:
```javascript
// Получение данных пользователя из Telegram
if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp;
  const user = tg.initDataUnsafe?.user;
  
  // Отправить данные на бэкенд для авторизации
  fetch('/api/auth/telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      initData: tg.initData,
      user: user
    })
  });
}
```

## 🔄 Development Workflow

Для быстрого редактирования без полной перезагрузки:

1. **Git-based workflow**
   ```bash
   git add .
   git commit -m "Update features"
   git push origin main
   # Auto-deploy via Vercel/Netlify
   ```

2. **Admin Panel** (уже есть)
   - Редактирование задач
   - Управление товарами
   - Модерация достижений

3. **Hot Config**
   - Конфиг в БД вместо кода
   - API для обновления настроек
   - Realtime обновления через WebSocket

## 💾 Data Migration Plan

localStorage → Database:
1. Export current localStorage data
2. Create migration scripts
3. Import to PostgreSQL/Supabase
4. Update API calls
5. Remove localStorage dependencies