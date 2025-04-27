const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { User } = require('../models');
const asyncHandler = require('express-async-handler');
const { AppError } = require('../utils/errorHandler');

/**
 * Извлечение токена из запроса
 * @param {Object} req - Express request объект
 * @returns {string|null} - JWT токен или null, если токен не найден
 */
const getTokenFromRequest = (req) => {
  // Проверка заголовка Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  
  // Проверка токена в cookie
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  return null;
};

/**
 * Middleware для проверки аутентификации
 */
const auth = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  // Если токен не найден
  if (!token) {
    throw new AppError('Не авторизован. Токен не предоставлен.', StatusCodes.UNAUTHORIZED);
  }

  try {
    // Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Проверка существования пользователя
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      throw new AppError('Пользователь с этим токеном больше не существует.', StatusCodes.UNAUTHORIZED);
    }

    // Добавление информации о пользователе к запросу
    req.user = user;
    req.userId = user.id;
    
    next();
  } catch (error) {
    // Ошибка верификации токена
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Недействительный токен. Пожалуйста, войдите снова.', StatusCodes.UNAUTHORIZED);
    }
    
    // Истек срок действия токена
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Срок действия токена истек. Пожалуйста, войдите снова.', StatusCodes.UNAUTHORIZED);
    }
    
    // Другие ошибки
    throw error;
  }
});

/**
 * Middleware для проверки прав администратора
 */
const adminAuth = asyncHandler(async (req, res, next) => {
  if (!req.user.isAdmin) {
    throw new AppError('Доступ запрещен. Требуются права администратора.', StatusCodes.FORBIDDEN);
  }
  
  next();
});

/**
 * Middleware для проверки, является ли пользователь врачом
 */
const doctorAuth = asyncHandler(async (req, res, next) => {
  if (!req.user.isDoctor) {
    throw new AppError('Доступ запрещен. Требуются права врача.', StatusCodes.FORBIDDEN);
  }
  
  next();
});

/**
 * Middleware для проверки, является ли пользователь владельцем ресурса или администратором
 * @param {string} paramName - Имя параметра, содержащего ID владельца ресурса
 */
const ownerOrAdminAuth = (paramName = 'id') => {
  return asyncHandler(async (req, res, next) => {
    const resourceOwnerId = parseInt(req.params[paramName] || req.body[paramName]);
    
    // Если пользователь администратор или владелец ресурса
    if (req.user.isAdmin || req.userId === resourceOwnerId) {
      return next();
    }
    
    throw new AppError('Доступ запрещен. Вы не являетесь владельцем этого ресурса.', StatusCodes.FORBIDDEN);
  });
};

module.exports = {
  auth,
  adminAuth,
  doctorAuth,
  ownerOrAdminAuth
};