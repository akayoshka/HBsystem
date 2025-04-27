// server.js - обновленный с интеграцией Swagger
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const { StatusCodes } = require('http-status-codes');
const { sequelize } = require('./models');
const { globalErrorHandler } = require('./utils/errorHandler');
const logger = require('./utils/logger');
const { rateLimit } = require('express-rate-limit');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
const path = require('path');

// Настройка Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HealthBooker API',
      version: '1.0.0',
      description: 'API для приложения бронирования приемов у врачей',
      contact: {
        name: 'API Support',
        email: 'support@healthbooker.com',
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js'], // Путь к файлам с маршрутами
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Инициализация Express приложения
const app = express();

// Настройка middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка статических файлов для загруженных изображений
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger документация
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Логирование HTTP-запросов
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Ограничение частоты запросов (rate limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов с одного IP в течение 15 минут
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Слишком много запросов, попробуйте позже.',
    code: StatusCodes.TOO_MANY_REQUESTS
  }
});
app.use(limiter);

// Основной маршрут для проверки
app.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Welcome to HealthBooker API',
    version: '1.0.0'
  });
});

// Проверка доступности маршрутов API - заглушки для безопасного подключения
// Эти маршруты будут работать, даже если реальные файлы маршрутов еще не созданы
try {
  // Пытаемся подключить маршруты auth
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
  logger.info('Маршруты аутентификации успешно подключены');
} catch (error) {
  // Создаем заглушку, если маршруты не найдены
  app.use('/api/auth', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Маршруты аутентификации будут доступны здесь' });
  });
  logger.warn('Используется заглушка для маршрутов аутентификации');
}

try {
  // Пытаемся подключить маршруты пользователей
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/user', userRoutes);
  logger.info('Маршруты пользователей успешно подключены');
} catch (error) {
  // Создаем заглушку, если маршруты не найдены
  app.use('/api/user', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Маршруты пользователей будут доступны здесь' });
  });
  logger.warn('Используется заглушка для маршрутов пользователей');
}

try {
  // Пытаемся подключить маршруты врачей
  const doctorRoutes = require('./routes/doctorRoutes');
  app.use('/api/doctor', doctorRoutes);
  logger.info('Маршруты врачей успешно подключены');
} catch (error) {
  // Создаем заглушку, если маршруты не найдены
  app.use('/api/doctor', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Маршруты врачей будут доступны здесь' });
  });
  logger.warn('Используется заглушка для маршрутов врачей');
}

try {
  // Пытаемся подключить маршруты записей на прием
  const appointmentRoutes = require('./routes/appointmentRoutes');
  app.use('/api/appointment', appointmentRoutes);
  logger.info('Маршруты записей на прием успешно подключены');
} catch (error) {
  // Создаем заглушку, если маршруты не найдены
  app.use('/api/appointment', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Маршруты записей на прием будут доступны здесь' });
  });
  logger.warn('Используется заглушка для маршрутов записей на прием');
}

try {
  // Пытаемся подключить маршруты уведомлений
  const notificationRoutes = require('./routes/notificationRoutes');
  app.use('/api/notification', notificationRoutes);
  logger.info('Маршруты уведомлений успешно подключены');
} catch (error) {
  // Создаем заглушку, если маршруты не найдены
  app.use('/api/notification', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'Маршруты уведомлений будут доступны здесь' });
  });
  logger.warn('Используется заглушка для маршрутов уведомлений');
}

// Обработка несуществующих маршрутов - должна быть после всех реальных маршрутов
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: 'error',
    message: `Маршрут ${req.originalUrl} не найден на этом сервере!`
  });
});

// Глобальный обработчик ошибок
app.use(globalErrorHandler);

// Запуск сервера
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  logger.info(`Сервер запущен на порту ${PORT}`);
  logger.info(`Документация API доступна по адресу: http://localhost:${PORT}/api-docs`);
  
  // Проверка соединения с базой данных
  try {
    await sequelize.authenticate();
    logger.info('Подключение к базе данных установлено успешно.');
  } catch (error) {
    logger.error(`Ошибка подключения к базе данных: ${error.message}`);
  }
});

// Обработка необработанных исключений
process.on('uncaughtException', (err) => {
  logger.error(`НЕПЕРЕХВАЧЕННОЕ ИСКЛЮЧЕНИЕ! Завершение работы...`);
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

// Обработка непойманных отказов промисов
process.on('unhandledRejection', (err) => {
  logger.error(`НЕОБРАБОТАННЫЙ ОТКАЗ ПРОМИСА! Завершение работы...`);
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;