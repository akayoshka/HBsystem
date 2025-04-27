const { body, param, query } = require('express-validator');

// Валидация параметра ID записи
exports.appointmentIdValidator = [
  param('id')
    .isInt().withMessage('ID записи должен быть целым числом')
];

// Валидация при создании записи на прием
exports.bookAppointmentValidator = [
  body('doctorId')
    .notEmpty().withMessage('ID врача обязателен')
    .isInt().withMessage('ID врача должен быть целым числом'),
  
  body('date')
    .notEmpty().withMessage('Дата приема обязательна')
    .isString().withMessage('Дата должна быть строкой')
    .custom(value => {
      // Проверка формата даты (опционально)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(value)) {
        throw new Error('Дата должна быть в формате YYYY-MM-DD или DD/MM/YYYY');
      }
      return true;
    }),
  
  body('time')
    .notEmpty().withMessage('Время приема обязательно')
    .isString().withMessage('Время должно быть строкой'),
  
  body('doctorname')
    .optional()
    .isString().withMessage('Имя врача должно быть строкой')
];

// Валидация при завершении записи на прием
exports.completeAppointmentValidator = [
  body('appointid')
    .notEmpty().withMessage('ID записи обязателен')
    .isInt().withMessage('ID записи должен быть целым числом'),
  
  body('doctorId')
    .notEmpty().withMessage('ID врача обязателен')
    .isInt().withMessage('ID врача должен быть целым числом'),
  
  body('doctorname')
    .optional()
    .isString().withMessage('Имя врача должно быть строкой')
];

// Валидация для фильтрации записей на прием
exports.filterAppointmentsValidator = [
  query('status')
    .optional()
    .isIn(['Pending', 'Completed', 'Cancelled']).withMessage('Статус должен быть Pending, Completed или Cancelled'),
  
  query('date')
    .optional()
    .isString().withMessage('Дата должна быть строкой'),
  
  query('doctorId')
    .optional()
    .isInt().withMessage('ID врача должен быть целым числом'),
  
  query('userId')
    .optional()
    .isInt().withMessage('ID пользователя должен быть целым числом')
];