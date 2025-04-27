const { body, param } = require('express-validator');

// Валидация параметра ID пользователя
exports.userIdValidator = [
  param('id')
    .isInt().withMessage('ID пользователя должен быть целым числом')
];

// Валидация при обновлении профиля
exports.updateProfileValidator = [
  body('firstname')
    .optional()
    .isLength({ min: 3 }).withMessage('Имя должно содержать не менее 3 символов'),
  
  body('lastname')
    .optional()
    .isLength({ min: 3 }).withMessage('Фамилия должна содержать не менее 3 символов'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Введите действительный email')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: 5 }).withMessage('Пароль должен содержать не менее 5 символов'),
  
  body('age')
    .optional()
    .isInt({ min: 0, max: 120 }).withMessage('Возраст должен быть числом от 0 до 120'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'neither']).withMessage('Пол должен быть male, female или neither'),
  
  body('mobile')
    .optional()
    .isString().withMessage('Мобильный номер должен быть строкой'),
  
  body('address')
    .optional()
    .isString().withMessage('Адрес должен быть строкой'),
  
  body('pic')
    .optional()
    .isURL().withMessage('Изображение должно быть действительным URL')
];

// Валидация при удалении пользователя
exports.deleteUserValidator = [
  body('userId')
    .isInt().withMessage('ID пользователя должен быть целым числом')
];
