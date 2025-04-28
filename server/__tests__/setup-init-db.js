// Этот скрипт инициализирует тестовую базу данных перед запуском интеграционных тестов
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Загружаем переменные окружения из .env.test
require('dotenv').config({ path: '.env.test' });

async function setupTestDatabase() {
  try {
    console.log('Setting up test database...');
    
    // SQLite не требует специальной настройки, так как он создается в памяти
    if (process.env.DB_DIALECT === 'sqlite') {
      console.log('Using SQLite for tests. No database setup required.');
      return;
    }
    
    // Настройка для PostgreSQL
    const DB_USER = process.env.DB_USER || 'postgres';
    const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_PORT = process.env.DB_PORT || '5432';
    const DB_NAME_TEST = process.env.DB_NAME_TEST || 'healthbooker_test';
    
    console.log(`Setting up PostgreSQL test database: ${DB_NAME_TEST}`);
    
    // Удаляем базу данных, если она существует
    try {
      await execPromise(`PGPASSWORD=${DB_PASSWORD} dropdb -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${DB_NAME_TEST} --if-exists`);
      console.log(`Database ${DB_NAME_TEST} dropped if it existed.`);
    } catch (error) {
      console.log(`Could not drop database ${DB_NAME_TEST}. It may not exist yet.`);
    }
    
    // Создаем новую базу данных
    await execPromise(`PGPASSWORD=${DB_PASSWORD} createdb -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${DB_NAME_TEST}`);
    console.log(`Database ${DB_NAME_TEST} created.`);
    
    console.log('Test database setup completed.');
  } catch (error) {
    console.error('Error setting up test database:', error);
    process.exit(1);
  }
}

// Запускаем настройку базы данных
setupTestDatabase();