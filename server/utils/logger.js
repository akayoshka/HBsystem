// utils/logger.js
// Простая реализация logger с использованием console
// В реальном приложении можно использовать winston или другие библиотеки

/**
 * Логирование информационных сообщений
 * @param {string} message - Сообщение для логирования
 */
const info = (message) => {
  console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
};

/**
 * Логирование сообщений об ошибках
 * @param {string} message - Сообщение об ошибке
 */
const error = (message) => {
  console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
};

/**
 * Логирование предупреждений
 * @param {string} message - Предупреждающее сообщение
 */
const warn = (message) => {
  console.warn(`[WARN] ${new Date().toISOString()}: ${message}`);
};

/**
 * Логирование отладочных сообщений
 * @param {string} message - Отладочное сообщение
 */
const debug = (message) => {
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`);
  }
};

module.exports = {
  info,
  error,
  warn,
  debug
};