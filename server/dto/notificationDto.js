/**
 * DTO для создания уведомления
 */
class NotificationCreateDto {
  constructor(data) {
    this.userId = data.userId;
    this.content = data.content;
  }
}

/**
 * DTO для ответа с данными уведомления
 */
class NotificationResponseDto {
  constructor(notification) {
    this.id = notification.id;
    this.userId = notification.userId;
    this.content = notification.content;
    this.isRead = notification.isRead;
    this.createdAt = notification.createdAt;
    this.updatedAt = notification.updatedAt;
  }
}

module.exports = {
  NotificationCreateDto,
  NotificationResponseDto
};