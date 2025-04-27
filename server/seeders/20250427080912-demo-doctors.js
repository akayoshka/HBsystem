'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Получаем доктора Jane Smith, используя правильный синтаксис PostgreSQL
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'jane@example.com'",
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );
    
    // Проверяем, найден ли пользователь
    if (users && users.length > 0) {
      const userId = users[0].id;
      
      return queryInterface.bulkInsert('doctors', [
        {
          userId: userId,
          specialization: 'Cardiology',
          experience: 5,
          fees: 150.00,
          isDoctor: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    }
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('doctors', null, {});
  }
};