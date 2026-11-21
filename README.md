# 📚 CampusBookHub

### A University Used Book Sharing Platform

CampusBookHub is a full-stack web application designed to help university students buy, sell, exchange, and share used academic books within their university community.

The platform provides an easy way for students to find affordable academic books and connect with other students.

## ✨ Key Features

### 👤 Authentication & User Management
- User registration and login
- JWT authentication with HTTP-only cookies
- User profile management
- Profile picture upload

### 📚 Book Management
- Add, edit, and manage book listings
- Browse and search available books
- Filter books by department, condition, and exchange type
- Contact book sellers

### 🔄 Book Exchange System
- Send and manage book requests
- Accept or complete book exchanges
- Manage exchange activities

### ⭐ Engagement Features
- Add books to wishlist
- Notifications
- Book reviews and ratings
- Responsive user interface

## 🛠️ Technology Stack

| Frontend | Backend |
|---|---|
| React.js | Node.js |
| Vite | Express.js |
| Tailwind CSS | MongoDB |
| React Router | Mongoose |
| Axios | JWT |
| | Bcrypt.js |
| | Multer |

**Cloud Services**
- Cloudinary — Image storage
- MongoDB Atlas — Cloud database

## 📁 Project Structure

```text
CampusBookHub/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   ├── Context/
│   │   ├── Pages/
│   │   └── Services/
│   └── package.json
│
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js and npm
- MongoDB Atlas account or local MongoDB
- Cloudinary account

### 1. Clone the Repository

```bash
git clone https://github.com/Anitosh-Das-Akash/CampusBookHub.git
cd CampusBookHub
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL provided by Vite, normally:

`http://localhost:5173`

## 🔐 Security

- Authentication uses JWT and HTTP-only cookies.
- Passwords are protected using bcrypt.
- Sensitive configuration is stored in environment variables.
- Never commit `.env` files or expose private API credentials.

## 🌐 Live Demo

[Visit CampusBookHub](https://campus-book-hub.vercel.app/)

## 👨‍💻 Developer

**Anitosh Das**

- GitHub: [Anitosh-Das-Akash](https://github.com/Anitosh-Das-Akash)

## 📄 License

This project is currently developed as a personal project.

---

<p align="center">
  <b>Built with ❤️ by Anitosh Das</b>
</p>

<p align="center">
  <i>Connecting students through books and knowledge.</i>
</p>
