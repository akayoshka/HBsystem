// utils/errorHandler.js
const { StatusCodes } = require('http-status-codes');

// Класс для API ошибок
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Обработчик операционных ошибок (которые мы предусмотрели)
const handleOperationalError = (err, req, res) => {
  const { statusCode, message } = err;
  res.status(statusCode).json({
    status: err.status,
    message
  });
};

// Обработчик непредвиденных ошибок
const handleCriticalError = (err, req, res) => {
  console.error('CRITICAL ERROR:', err);
  
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Что-то пошло не так!'
  });
};

// Middleware для глобальной обработки ошибок
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  // В продакшене не показываем технические детали
  if (err.isOperational) {
    return handleOperationalError(err, req, res);
  }
  
  // Непредвиденные ошибки
  return handleCriticalError(err, req, res);
};

module.exports = {
  AppError,
  globalErrorHandler
};