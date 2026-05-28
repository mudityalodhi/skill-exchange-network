# 🔄 SEN — Skill Exchange Network

> **Exchange skills, not money. Learn from peers, teach what you know.**

SEN is a full-stack MERN web application where people exchange skills using a
credit-based barter system — no money involved. A React developer can teach
React and learn video editing in return. A designer can teach Photoshop and
learn public speaking.

![Tech Stack](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)

## 🌐 Live Demo
- **Frontend:** https://sen-app.vercel.app
- **Backend API:** https://sen-api.onrender.com/api/health

---

## ✨ Features

- 🔐 JWT Authentication (Register / Login)
- 🔄 Skill Exchange System with credit-based barter
- 💰 SEN Credits — earn by teaching, spend to learn
- 🤖 AI-based user matching by skill interest
- 💬 Real-time Chat powered by Socket.io
- 🔔 Live Notifications (Socket.io)
- 📚 Knowledge Hub — 15 article categories
- ⭐ Review & Rating system
- 🌙 Dark / Light mode toggle
- 📱 Fully responsive (mobile-first)
- 🔖 Bookmark users and articles

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Real-time | Socket.io |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/sen.git
cd sen

# 2. Configure environment
# Edit .env file — add your MONGO_URI and JWT_SECRET

# 3. Install all dependencies
npm run install-all

# 4. Run project
npm run dev
```

Frontend → `http://localhost:5173`
Backend  → `http://localhost:5000`

---

## ⚙️ Environment Variables

Create a `.env` file in the root folder:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

---

## 📁 Folder Structure

sen/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── services/
└── server/          # Express backend
├── controllers/
├── models/
├── routes/
└── sockets/

---

## 👨‍💻 Author

**Muditya** — MCA Student | Full Stack Developer
[GitHub](https://github.com/mudityalodhi)

---

*Built with ❤️ using the MERN Stack*