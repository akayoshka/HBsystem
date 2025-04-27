// validators/notificationValidators.js
const { body, param, query } = require('express-validator');

// Валидация параметра ID уведомления
exports.notificationIdValidator = [
  param('id')
    .isInt().withMessage('ID уведомления должен быть целым числом')
];

// Валидация для создания уведомления
exports.createNotificationValidator = [
  body('userId')
    .notEmpty().withMessage('ID пользователя обязателен')
    .isInt().withMessage('ID пользователя должен быть целым числом'),
  
  body('content')
    .notEmpty().withMessage('Содержание уведомления обязательно')
    .isString().withMessage('Содержание должно быть строкой')
];

// Валидация для пометки уведомления как прочитанного
exports.markAsReadValidator = [
  body('notificationId')
    .notEmpty().withMessage('ID уведомления обязателен')
    .isInt().withMessage('ID уведомления должен быть целым числом')
];

// Валидация для удаления уведомления
exports.deleteNotificationValidator = [
  param('id')
    .isInt().withMessage('ID уведомления должен быть целым числом')
];

// Валидация для фильтрации уведомлений
exports.filterNotificationsValidator = [
  query('isRead')
    .optional()
    .isBoolean().withMessage('isRead должен быть булевым значением'),
  
  query('limit')
    .optional()
    .isInt({ min: 1 }).withMessage('Лимит должен быть положительным числом'),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Страница должна быть положительным числом')
];