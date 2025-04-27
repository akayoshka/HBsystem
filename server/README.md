# HealthBooker 🧑‍⚕️

<div align="center">
  <br>
  <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" alt="Vue.js" />
  <img src="https://img.shields.io/badge/Vuex-35495E?style=for-the-badge&logo=vuex&logoColor=4FC08D" alt="Vuex" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white" alt="Sequelize" />
  <br>
</div>

## Description

HealthBooker is a comprehensive healthcare platform designed to streamline the process of connecting patients with healthcare providers. Our application provides a seamless experience for users and doctors alike.

With HealthBooker, users can:
- Register and manage their profiles
- Browse available doctors
- Book appointments with preferred healthcare professionals
- Receive notifications about appointment status
- Apply to become a verified doctor on the platform

Administrators can:
- Manage users and doctors
- Approve or reject doctor applications
- Oversee appointments and system operations

## Features

- **User Authentication & Authorization**: Secure registration and login
- **Profile Management**: Users can update their personal information
- **Doctor Directory**: Browse and search for available doctors
- **Appointment Booking**: Schedule appointments with doctors
- **Admin Dashboard**: Complete management panel for administrators
- **Doctor Application**: Healthcare professionals can apply to join the platform
- **Notifications**: Real-time updates about appointments and applications
- **Responsive Design**: Optimized for both desktop and mobile devices

## Tech Stack

### Frontend
- **Vue.js 3**: Progressive JavaScript framework
- **Vuex**: State management
- **Vue Router**: Navigation
- **Axios**: HTTP client
- **SCSS**: CSS preprocessor

### Backend
- **Express.js**: Web application framework
- **PostgreSQL**: Relational database
- **Sequelize ORM**: Database abstraction
- **JSON Web Tokens**: Authentication
- **bcrypt**: Password hashing

### DevOps & Tools
- **pgAdmin**: Database management
- **Git**: Version control
- **npm**: Package management
- **Jest**: Testing framework
- **ESLint**: Code linting

## Project Structure

```
healthbooker/
├── client/               # Vue.js frontend
│   ├── public/           # Static files
│   ├── src/              # Source files
│   │   ├── assets/       # Images, fonts, etc.
│   │   ├── components/   # Vue components
│   │   ├── router/       # Vue Router
│   │   ├── store/        # Vuex store
│   │   ├── views/        # Page components
│   │   ├── App.vue       # Main app component
│   │   └── main.js       # Entry point
│   └── package.json      # Dependencies
│
├── server/               # Express.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Sequelize models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── validators/       # Request validation
│   ├── server.js         # Entry point
│   └── package.json      # Dependencies
│
└── README.md             # Project documentation
```

## Installation

### Prerequisites
- Node.js (v14.x or higher)
- npm (v6.x or higher)
- PostgreSQL (v12.x or higher)
- pgAdmin (optional)

### Setup Database
1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE healthbooker;
   ```

2. Configure database connection in server/.env file

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/akayoshka/healthbooker.git
   cd healthbooker
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and other settings
   ```

4. Run database migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```

5. Seed the database (optional):
   ```bash
   npx sequelize-cli db:seed:all
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env if necessary
   ```

4. Start the development server:
   ```bash
   npm run serve
   ```

5. Access the application at:
   ```
   http://localhost:8080
   ```

## API Documentation

The API documentation is available when the server is running:
```
http://localhost:5000/api-docs
```

### Main API Endpoints

#### Authentication
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - User login

#### Users
- `GET /api/user/getuser/:id` - Get user data
- `GET /api/user/getallusers` - Get all users
- `PUT /api/user/updateprofile` - Update user profile
- `DELETE /api/user/deleteuser` - Delete user

#### Doctors
- `GET /api/doctor/getalldoctors` - Get all doctors
- `GET /api/doctor/getnotdoctors` - Get doctor applications
- `POST /api/doctor/applyfordoctor` - Apply to become a doctor
- `PUT /api/doctor/deletedoctor` - Delete a doctor
- `PUT /api/doctor/acceptdoctor` - Accept doctor application
- `PUT /api/doctor/rejectdoctor` - Reject doctor application

#### Appointments
- `GET /api/appointment/getallappointments` - Get all appointments
- `POST /api/appointment/bookappointment` - Book an appointment
- `PUT /api/appointment/completed` - Mark appointment as completed

#### Notifications
- `GET /api/notification/getallnotifs` - Get all user notifications

## Testing

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd client
npm run test:unit
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

