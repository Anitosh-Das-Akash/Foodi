# Foodies

Foodies is a short-form food video application. Users can discover restaurant videos, visit food partner profiles, love and save posts, and comment. Food partners can publish videos and reply to comments on their own posts.

## Features

- Full-screen, vertically scrolling video feed with snap scrolling.
- User registration and sign-in.
- Food partner registration and sign-in.
- Food partner profiles with restaurant details and uploaded videos.
- Upload food videos with a title and description.
- Love and save videos as a user.
- View public love counts and post-specific comments.
- Reply to comments as the food partner who owns the post.
- User profile and saved-video pages with bottom navigation.

## Project structure

```text
Foodies/
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
└── frontend/
    ├── index.html
    └── src/
        ├── components/
        ├── pages/
        └── routes/
```

The backend is an Express API using MongoDB through Mongoose. Uploaded video files are stored using ImageKit. The frontend is a React single-page application built with Vite.

## Requirements

- Node.js and npm
- MongoDB connection string
- ImageKit account and private API key for video uploads

## Configuration

Create `backend/.env` with the following values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/foodies
JWT_SECRET=replace-with-a-long-random-secret
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
```

Use your own MongoDB connection string and ImageKit private key. Keep `.env` files and credentials private; do not commit them to source control.

The frontend currently calls the backend at `http://localhost:3000`, and the backend allows the Vite development origin `http://localhost:5173`. If you change either port or deploy the application, update the API URL and CORS origin to match.

## Run locally

Open two terminals from the project directory.

### Start the backend

```powershell
cd backend
npm install
node server.js
```

The API starts on `http://localhost:3000` after it connects to MongoDB.

### Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Main application routes

| Route | Purpose |
| --- | --- |
| `/users/register` | User registration |
| `/users/login` | User sign-in |
| `/user/dashboard` | User video feed |
| `/user/saved` | Videos saved by the signed-in user |
| `/user/profile` | Signed-in user's profile |
| `/foodpartner/register` | Food partner registration |
| `/foodpartner/login` | Food partner sign-in |
| `/foodpartner/dashboard` | Food partner video feed |
| `/foodpartner/create` | Create and upload a food video |
| `/foodpartner/:partnerId` | Food partner profile and videos |

Authentication uses an HTTP cookie. User-only actions, such as loving, saving, or commenting on a post, require the user to be signed in. Comment replies require the owning food partner to be signed in.

## Development commands

Run these commands from `frontend/`:

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

The backend package does not currently define start, development, or automated test scripts. Start it with `node server.js` from `backend/`.
