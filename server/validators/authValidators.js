const { body } = require('express-validator');

// Валидация при регистрации
const registerValidator = [
  body('firstname')
    .notEmpty().withMessage('Имя обязательно')
    .isLength({ min: 3 }).withMessage('Имя должно содержать не менее 3 символов'),
  
  body('lastname')
    .notEmpty().withMessage('Фамилия обязательна')
    .isLength({ min: 3 }).withMessage('Фамилия должна содержать не менее 3 символов'),
  
  body('email')
    .notEmpty().withMessage('Email обязателен')
    .isEmail().withMessage('Введите действительный email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Пароль обязателен')
    .isLength({ min: 5 }).withMessage('Пароль должен содержать не менее 5 символов'),
  
  body('pic')
    .optional()
    .isURL().withMessage('Изображение должно быть действительным URL')
];

// Валидация при входе
const loginValidator = [
  body('email')
    .notEmpty().withMessage('Email обязателен')
    .isEmail().withMessage('Введите действительный email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Пароль обязателен')
];

// Валидация при смене пароля
const changePasswordValidator = [
  body('currentPassword')
    .notEmpty().withMessage('Текущий пароль обязателен'),
  
  body('newPassword')
    .notEmpty().withMessage('Новый пароль обязателен')
    .isLength({ min: 5 }).withMessage('Новый пароль должен содержать не менее 5 символов')
];

module.exports = {
  registerValidator,
  loginValidator,
  changePasswordValidator
};