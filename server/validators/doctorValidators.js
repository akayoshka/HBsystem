const { body, param, query } = require('express-validator');

// Валидация параметра ID доктора
exports.doctorIdValidator = [
  param('id')
    .isInt().withMessage('ID доктора должен быть целым числом')
];

// Валидация при подаче заявки на роль врача
exports.applyForDoctorValidator = [
  body('specialization')
    .notEmpty().withMessage('Специализация обязательна')
    .isString().withMessage('Специализация должна быть строкой'),
  
  body('experience')
    .notEmpty().withMessage('Опыт работы обязателен')
    .isInt({ min: 0 }).withMessage('Опыт работы должен быть неотрицательным числом'),
  
  body('fees')
    .notEmpty().withMessage('Стоимость консультации обязательна')
    .isFloat({ min: 0 }).withMessage('Стоимость должна быть неотрицательным числом')
];

// Валидация при обновлении информации о враче
exports.updateDoctorValidator = [
  body('specialization')
    .optional()
    .isString().withMessage('Специализация должна быть строкой'),
  
  body('experience')
    .optional()
    .isInt({ min: 0 }).withMessage('Опыт работы должен быть неотрицательным числом'),
  
  body('fees')
    .optional()
    .isFloat({ min: 0 }).withMessage('Стоимость должна быть неотрицательным числом')
];

// Валидация при принятии/отклонении заявки на роль врача
exports.doctorActionValidator = [
  body('id')
    .notEmpty().withMessage('ID пользователя обязателен')
    .isInt().withMessage('ID пользователя должен быть целым числом')
];

// Валидация при удалении врача
exports.deleteDoctorValidator = [
  body('userId')
    .notEmpty().withMessage('ID пользователя обязателен')
    .isInt().withMessage('ID пользователя должен быть целым числом')
];

// Валидация для поиска и фильтрации врачей
exports.searchDoctorsValidator = [
  query('specialization')
    .optional()
    .isString().withMessage('Специализация должна быть строкой'),
  
  query('minExperience')
    .optional()
    .isInt({ min: 0 }).withMessage('Минимальный опыт должен быть неотрицательным числом'),
  
  query('maxFees')
    .optional()
    .isFloat({ min: 0 }).withMessage('Максимальная стоимость должна быть неотрицательным числом'),
  
  query('searchTerm')
    .optional()
    .isString().withMessage('Поисковый запрос должен быть строкой')
];