# 🔧 Backend API Structure для GRITHER

## Общая архитектура

```
Backend (Node.js + Express/Fastify)
├── Auth (Telegram Web App validation)
├── Database (PostgreSQL/Supabase)
├── Real-time (WebSockets/SSE)
└── Telegram Bot API integration
```

## Основные API Endpoints

### 🔐 Authentication
```
POST /api/auth/telegram
- Валидация initData из Telegram
- Создание/обновление пользователя
- Выдача JWT токена
```

### 👤 Users
```
GET    /api/users/me           - Профиль текущего пользователя
PUT    /api/users/me           - Обновление профиля
GET    /api/users/leaderboard  - Лидерборд
GET    /api/users/:id          - Профиль пользователя
POST   /api/users/avatar       - Загрузка аватара
```

### 🏆 Achievements
```
GET    /api/achievements       - Список всех достижений
POST   /api/achievements       - Создание достижения (admin)
PUT    /api/achievements/:id   - Обновление достижения (admin)
POST   /api/achievements/:id/unlock - Разблокировка достижения
GET    /api/users/me/achievements - Мои достижения
```

### 📋 Tasks
```
GET    /api/tasks             - Список задач пользователя
POST   /api/tasks             - Создание задачи (admin)
PUT    /api/tasks/:id         - Обновление задачи (admin)
POST   /api/tasks/:id/complete - Завершение задачи
DELETE /api/tasks/:id         - Удаление задачи (admin)
```

### ⚔️ Battles
```
GET    /api/battles           - Список баттлов пользователя
POST   /api/battles/invite    - Отправка приглашения на баттл
POST   /api/battles/:id/accept - Принятие приглашения
POST   /api/battles/:id/decline - Отклонение приглашения
POST   /api/battles/:id/complete - Завершение баттла
GET    /api/battles/history   - История баттлов
```

### 🛍️ Shop
```
GET    /api/shop/items        - Список товаров
POST   /api/shop/items        - Добавление товара (admin)
PUT    /api/shop/items/:id    - Обновление товара (admin)
POST   /api/shop/purchase     - Покупка товара
GET    /api/shop/orders       - Мои заказы
PUT    /api/shop/orders/:id   - Обновление статуса заказа (admin)
```

### 📦 Cases
```
GET    /api/cases             - Список кейсов
POST   /api/cases             - Создание кейса (admin)
POST   /api/cases/:id/open    - Открытие кейса
GET    /api/cases/history     - История открытых кейсов
PUT    /api/cases/:id         - Обновление кейса (admin)
```

### 🔔 Notifications
```
GET    /api/notifications     - Список уведомлений
POST   /api/notifications/read - Пометка как прочитано
DELETE /api/notifications/:id - Удаление уведомления
POST   /api/notifications/send - Отправка уведомления (admin)
```

### 📊 Analytics (Admin)
```
GET    /api/admin/stats       - Общая статистика
GET    /api/admin/users       - Управление пользователями
GET    /api/admin/activity    - Активность пользователей
POST   /api/admin/announcement - Объявление для всех
```

## Database Schema (PostgreSQL)

### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  balance INTEGER DEFAULT 1000,
  rating INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_admin BOOLEAN DEFAULT false,
  last_active TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Achievements
```sql
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  category VARCHAR(100),
  reward INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  achievement_id INTEGER REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

### Tasks
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee_id INTEGER REFERENCES users(id),
  assigner_id INTEGER REFERENCES users(id),
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'pending',
  reward INTEGER DEFAULT 0,
  experience INTEGER DEFAULT 0,
  deadline TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Battles
```sql
CREATE TABLE battles (
  id SERIAL PRIMARY KEY,
  challenger_id INTEGER REFERENCES users(id),
  opponent_id INTEGER REFERENCES users(id),
  stake INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  winner_id INTEGER REFERENCES users(id),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Real-time Features (WebSockets)

### События для real-time обновлений:
```javascript
// Client подписки
socket.on('battle_invitation', (data) => {
  // Новое приглашение на баттл
});

socket.on('achievement_unlocked', (data) => {
  // Новое достижение разблокировано
});

socket.on('task_assigned', (data) => {
  // Новая задача назначена
});

socket.on('shop_item_added', (data) => {
  // Новый товар в магазине
});

socket.on('notification', (data) => {
  // Новое уведомление
});
```

## Middleware

### Authentication
```javascript
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

### Telegram Init Data Validation
```javascript
const validateTelegramData = (req, res, next) => {
  const { initData } = req.body;
  
  if (!validateTelegramWebAppData(initData, process.env.TELEGRAM_BOT_TOKEN)) {
    return res.status(400).json({ error: 'Invalid Telegram data' });
  }
  
  next();
};
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/grither
REDIS_URL=redis://localhost:6379

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_WEBHOOK_URL=https://your-api.com/webhook

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# App
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-app.vercel.app

# External APIs
UNSPLASH_ACCESS_KEY=your_unsplash_key
CLOUDINARY_URL=your_cloudinary_url
```

## Deployment для API

### Railway/Render
```yaml
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
```

### Vercel Functions (альтернатива)
```javascript
// api/auth/telegram.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Обработка авторизации через Telegram
  }
}
```

## Интеграция с Frontend

```javascript
// utils/api.js
const API_BASE = process.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  async authenticateWithTelegram(initData) {
    const response = await fetch(`${API_BASE}/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData })
    });
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  }
  
  async getProfile() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    return response.json();
  }
}
```

Это базовая структура для полноценного backend API! 🚀