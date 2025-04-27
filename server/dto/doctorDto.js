/**
 * DTO для подачи заявки на роль врача
 */
class DoctorApplicationDto {
  constructor(data) {
    this.userId = data.userId;
    this.specialization = data.specialization;
    this.experience = data.experience;
    this.fees = data.fees;
  }
}

/**
 * DTO для ответа с данными врача
 */
class DoctorResponseDto {
  constructor(doctor) {
    this.id = doctor.id;
    this.userId = doctor.userId;
    this.specialization = doctor.specialization;
    this.experience = doctor.experience;
    this.fees = doctor.fees;
    this.isDoctor = doctor.isDoctor;
    this.createdAt = doctor.createdAt;
    this.updatedAt = doctor.updatedAt;
    
    // Добавляем информацию о пользователе, если она есть
    if (doctor.user) {
      this.user = {
        id: doctor.user.id,
        firstname: doctor.user.firstname,
        lastname: doctor.user.lastname,
        email: doctor.user.email,
        mobile: doctor.user.mobile,
        pic: doctor.user.pic
      };
    }
  }
}

module.exports = {
  DoctorApplicationDto,
  DoctorResponseDto
};