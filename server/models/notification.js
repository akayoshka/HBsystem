'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      // Связь с User
      Notification.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }

    // Получить все уведомления для пользователя
    static async getNotificationsForUser(userId) {
      return await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
      });
    }

    // Отметить уведомление как прочитанное
    async markAsRead() {
      this.isRead = true;
      return await this.save();
    }
  }
  
  Notification.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    content: {
      type: DataTypes.TEXT,
      defaultValue: ''
    }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true
  });
  
  return Notification;
};