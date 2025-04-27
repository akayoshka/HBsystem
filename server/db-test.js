// db-test.js
console.log("Начало теста подключения к БД");
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: console.log
  }
);

async function testConnection() {
  try {
    console.log("Проверка подключения...");
    await sequelize.authenticate();
    console.log('Успешное подключение к базе данных.');
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
  } finally {
    console.log("Тест завершен");
  }
}

testConnection();