/**
 * DTO для пользователя при регистрации
 */
class UserRegistrationDto {
  constructor(data) {
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.email = data.email;
    this.password = data.password;
    this.pic = data.pic || undefined;
  }
}

/**
 * DTO для входа пользователя
 */
class UserLoginDto {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
  }
}

/**
 * DTO для обновления профиля пользователя
 */
class UserUpdateDto {
  constructor(data) {
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.email = data.email;
    this.age = data.age;
    this.gender = data.gender;
    this.mobile = data.mobile;
    this.address = data.address;
    this.pic = data.pic;
    
    // Пароль является опциональным
    if (data.password) {
      this.password = data.password;
    }
  }
}

/**
 * DTO для ответа с данными пользователя
 */
class UserResponseDto {
  constructor(user) {
    this.id = user.id;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.isAdmin = user.isAdmin;
    this.isDoctor = user.isDoctor;
    this.age = user.age;
    this.gender = user.gender;
    this.mobile = user.mobile;
    this.address = user.address;
    this.status = user.status;
    this.pic = user.pic;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

module.exports = {
  UserRegistrationDto,
  UserLoginDto,
  UserUpdateDto,
  UserResponseDto
};