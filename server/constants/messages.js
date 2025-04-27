// constants/messages.js
module.exports = {
    // Общие сообщения
    WELCOME: 'Добро пожаловать в API HealthBooker',
    NOT_FOUND: 'Ресурс не найден',
    SERVER_ERROR: 'Внутренняя ошибка сервера',
    FORBIDDEN: 'Доступ запрещен',
    
    // Сообщения аутентификации
    AUTH_SUCCESS: 'Аутентификация успешна',
    AUTH_FAILED: 'Неверные учетные данные',
    TOKEN_INVALID: 'Недействительный токен',
    NOT_AUTHORIZED: 'Не авторизован',
    
    // Пользователи
    USER_CREATED: 'Пользователь успешно создан',
    USER_UPDATED: 'Пользователь успешно обновлен',
    USER_DELETED: 'Пользователь успешно удален',
    USER_NOT_FOUND: 'Пользователь не найден',
    EMAIL_EXISTS: 'Электронная почта уже используется',
    
    // Врачи
    DOCTOR_APPLIED: 'Заявка на роль врача отправлена',
    DOCTOR_ACCEPTED: 'Заявка врача принята',
    DOCTOR_REJECTED: 'Заявка врача отклонена',
    DOCTOR_DELETED: 'Врач успешно удален',
    DOCTOR_NOT_FOUND: 'Врач не найден',
    DOCTOR_APPLICATION_EXISTS: 'Заявка уже существует',
    
    // Записи на прием
    APPOINTMENT_BOOKED: 'Запись на прием успешно создана',
    APPOINTMENT_COMPLETED: 'Прием завершен',
    APPOINTMENT_CANCELED: 'Запись на прием отменена',
    APPOINTMENT_NOT_FOUND: 'Запись на прием не найдена',
    
    // Уведомления
    NOTIFICATION_CREATED: 'Уведомление создано',
    NOTIFICATION_MARKED_READ: 'Уведомление отмечено как прочитанное',
    NOTIFICATION_DELETED: 'Уведомление удалено',
    NOTIFICATION_NOT_FOUND: 'Уведомление не найдено'
  };