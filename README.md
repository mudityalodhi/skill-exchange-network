# 🔄 SEN — Skill Exchange Network

A full-stack MERN application where people exchange skills instead of money using a credit-based barter system.

![SEN Banner](https://via.placeholder.com/1200x400/0f0f0f/ef4444?text=SEN+—+Skill+Exchange+Network)

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + bcryptjs |
| **Real-time** | Socket.io |
| **File Uploads** | Multer + Cloudinary (optional) |
| **State** | React Context API |
| **Routing** | React Router v6 |

---

## 📁 Project Structure

```
sen/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route-level pages
│       ├── layouts/         # Page layout wrappers
│       ├── context/         # Auth, Theme, Socket providers
│       ├── services/        # Axios API service functions
│       └── routes/          # Protected route guard
├── server/                  # Express backend
│   ├── config/              # DB + Cloudinary config
│   ├── controllers/         # Route handler logic
│   ├── middleware/          # Auth, error, upload middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express routers
│   └── sockets/             # Socket.io manager
├── .env                     # Environment variables
└── package.json             # Root with concurrently scripts
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/your-username/sen.git
cd sen
```

### 2. Configure environment variables
Edit the `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/sen_db
JWT_SECRET=your_super_secret_key_here
CLIENT_URL=http://localhost:5173

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Install all dependencies
```bash
npm run install-all
```

### 4. Run the project
```bash
npm run dev
```

This starts:
- **Backend** at `http://localhost:5000`
- **Frontend** at `http://localhost:5173`

---

## 🌐 API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/password` | Update password |

### Users
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/users` | Get all users (with filters) |
| GET | `/api/users/:id` | Get user profile |
| PUT | `/api/users/profile` | Update own profile |
| POST | `/api/users/avatar` | Upload avatar |
| POST | `/api/users/:id/bookmark` | Bookmark/unbookmark user |
| GET | `/api/users/matches` | Get AI-matched users |
| GET | `/api/users/dashboard` | Get dashboard data |

### Exchanges
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/exchanges` | Send exchange request |
| GET | `/api/exchanges` | Get my exchanges |
| GET | `/api/exchanges/:id` | Get exchange detail |
| PUT | `/api/exchanges/:id/respond` | Accept/reject |
| PUT | `/api/exchanges/:id/complete` | Mark complete |

### Articles
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/articles` | Get all articles |
| GET | `/api/articles/categories` | Get categories |
| GET | `/api/articles/:slug` | Get article |
| POST | `/api/articles` | Create (Admin) |
| PUT | `/api/articles/:id` | Update (Admin) |
| DELETE | `/api/articles/:id` | Delete (Admin) |
| POST | `/api/articles/:id/like` | Like/unlike |
| POST | `/api/articles/:id/bookmark` | Bookmark |

### Chat
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/chat/conversations` | Get or create conversation |
| GET | `/api/chat/conversations` | Get all conversations |
| GET | `/api/chat/conversations/:id/messages` | Get messages |
| POST | `/api/chat/conversations/:id/messages` | Send message |

---

## ⚡ Features

- 🔐 **JWT Authentication** — Secure login/register with token refresh
- 🔄 **Skill Exchange System** — Send, accept, reject, complete exchanges
- 💰 **Credit System** — Earn credits by teaching, spend to learn
- 🤖 **AI Matching** — Smart recommendations based on skill interests
- 💬 **Real-time Chat** — Socket.io powered instant messaging
- 🔔 **Live Notifications** — Real-time notification delivery
- 📚 **Knowledge Hub** — 15 article categories with search & filter
- 🌙 **Dark/Light Mode** — Persisted theme preference
- 📱 **Fully Responsive** — Mobile-first design
- ⭐ **Review System** — Star ratings for completed exchanges
- 🔖 **Bookmarks** — Save users and articles
- 🖼️ **Image Uploads** — Cloudinary or local storage

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#ef4444` (Red) |
| Green | `#22c55e` |
| Background | `#0f0f0f` |
| Card | `#242424` |
| Border | `#2e2e2e` |
| Heading Font | Outfit |
| Body Font | Jost |

---

## 🏗️ Seeding Sample Data

After starting the server, make an admin account manually:

```bash
# In MongoDB compass or shell
db.users.updateOne({ email: "admin@sen.app" }, { $set: { role: "admin" } })
```

Then create sample articles via the API using Postman or Thunder Client with the admin JWT.

---

## 📝 License

MIT License — feel free to use this project for learning and personal projects.

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

---

*Built with ❤️ on the MERN Stack*
