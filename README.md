# 🍔 Foodi — Short-Form Food Video Platform

A full-stack food video sharing platform where users can discover restaurant videos, interact with food content, and explore food partners. Restaurants and food partners can showcase their food through short videos and engage with their audience.

## ✨ Features

### 👤 User Features
- User registration and authentication
- Browse a full-screen, vertically scrolling food video feed
- Like and save food videos
- Comment on videos
- View user profiles
- Access saved videos

### 🏪 Food Partner Features
- Food partner registration and authentication
- Create and manage food partner profiles
- Upload food videos with titles and descriptions
- View restaurant and food partner profiles
- Reply to comments on their own videos

### 🎬 Video Experience
- Full-screen vertical video feed
- Snap scrolling between videos
- Public like counts
- Video-specific comments

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | Cookie-based authentication |
| Media Storage | ImageKit |
| API Testing | Postman |

## 📁 Project Structure

```text
Foodi/
├── .postman/
├── backend/
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── controllers/
│       ├── db/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── services/
│
├── frontend/
│   ├── index.html
│   └── src/
│       ├── components/
│       ├── pages/
│       └── routes/
│
├── .gitignore
└── README.md
```

## ⚙️ Requirements

Before running the project, make sure you have:

- Node.js
- npm
- MongoDB
- ImageKit account and private API key

## 🔐 Environment Configuration

Create a `.env` file inside the `backend` directory:

```env
MONGO_URI=mongodb://127.0.0.1:27017/foodies
JWT_SECRET=your_long_random_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

Use your own MongoDB connection string and ImageKit credentials.

**Important:** Never commit your `.env` file or expose private API keys on GitHub.

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Anitosh-Das-Akash/Foodi.git
```

```bash
cd Foodi
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create your `.env` file and configure the required environment variables.

Start the backend:

```bash
node server.js
```

The backend runs at:

`http://localhost:3000`

### 3. Set up the Frontend

Open another terminal:

```bash
cd Foodi/frontend
npm install
npm run dev
```

The frontend runs at:

`http://localhost:5173`

## 🔗 Main Application Routes

| Route | Description |
|---|---|
| `/users/register` | User registration |
| `/users/login` | User login |
| `/user/dashboard` | User video feed |
| `/user/saved` | Saved videos |
| `/user/profile` | User profile |
| `/foodpartner/register` | Food partner registration |
| `/foodpartner/login` | Food partner login |
| `/foodpartner/dashboard` | Food partner dashboard |
| `/foodpartner/create` | Upload food videos |
| `/foodpartner/:partnerId` | Food partner profile |

## 🔒 Authentication & Security

- Authentication uses HTTP cookies.
- User-only actions require user authentication.
- Food partner replies require the owning food partner to be authenticated.
- Environment credentials must remain private.

## 🌐 Development Configuration

The frontend currently communicates with the backend at:

`http://localhost:3000`

The backend allows the Vite development origin:

`http://localhost:5173`

Update the API URL and CORS configuration when deploying the application.

## 📦 Development Commands

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
node server.js
```

The backend package currently does not define separate start, development, or automated test scripts.

---

<p align="center">
  <b>Built with ❤️ by Anitosh Das</b>
</p>

<p align="center">
  <i>Learning, building, and creating meaningful web experiences.</i>
</p>

