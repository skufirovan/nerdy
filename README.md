# Telegram Bot с TypeScript и алиасами путей

## Быстрый старт

```bash
npm install
npm run dev     # Запуск в режиме разработки
npm run build   # Сборка проекта
npm start       # Запуск собранного проекта
```

## Алиасы путей

В проекте настроены следующие алиасы:

- `@bot/*` → `src/bot/*`
- `@controller` → `src/controller/index.ts`
- `@core/*` → `src/core/*`
- `@domain/*` → `src/domain/*`
- `@infrastructure/*` → `src/infrastructure/*`
- `@middlewares/*` → `src/middlewares/*`
- `@utils/*` → `src/utils/*`

### Пример использования

```typescript
import { bot } from '@bot/index';
import { UserService } from '@core/services/UserService';
import { logger } from '@utils/logger';
```

## Структура проекта

```
src/
├── bot/           # Логика телеграм бота
├── controller/    # Контроллеры
├── core/          # Бизнес-логика
├── domain/        # Модели и DTO
├── infrastructure/# Репозитории и внешние сервисы
├── middlewares/   # Middleware для бота
├── utils/         # Утилиты
└── main.ts        # Точка входа
```

## Скрипты

- `npm run dev` - Запуск в режиме разработки с hot reload
- `npm run build` - Сборка с помощью Babel (быстро, без проверки типов)
- `npm run build:tsc` - Сборка с TypeScript (медленно, с проверкой типов)
- `npm start` - Запуск собранного проекта
- `npm test` - Запуск тестов

## Как это работает

1. **Разработка**: Используется `tsx` для запуска TypeScript напрямую с поддержкой алиасов
2. **Сборка**: Babel транспилирует TypeScript и автоматически разрешает алиасы путей
3. **Запуск**: Node.js запускает обычный JavaScript без дополнительных зависимостей

## Настройка алиасов

Алиасы настроены в двух местах:

1. **tsconfig.json** - для TypeScript и IDE
2. **babel.config.js** - для транспиляции в production

Если нужно добавить новый алиас, обновите оба файла.