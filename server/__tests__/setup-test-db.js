const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function setupTestDb() {
  try {
    // Переменные окружения для подключения к базе данных
    const DB_USER = process.env.DB_USER || 'postgres';
    const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
    const DB_HOST = process.env.DB_HOST || 'localhost';
    const DB_PORT = process.env.DB_PORT || '5432';
    const DB_NAME_TEST = process.env.DB_NAME_TEST || 'healthbooker_test';
    
    console.log('Setting up test database...');
    
    // Удаляем базу данных, если она существует
    try {
      await execPromise(`PGPASSWORD=${DB_PASSWORD} dropdb -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} ${DB_NAME_TEST}`);
      console.log(`Database ${DB_NAME_TEST} dropped.`);
    } catch (error) {
      console.log(`Database ${DB_NAME_TEST} does not exist or could not be dropped.`);
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
setupTestDb();