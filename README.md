# 🛡️ SmartComplaint AI

> AI-Based Smart Complaint Management System — MERN Stack

An intelligent complaint management platform that leverages AI to automatically classify complaint priority, recommend responsible departments, generate complaint summaries, and create automated response messages.

---

## ✨ Features

### 📋 Complaint Management
- **Register Complaints** — Submit complaints with name, email, title, description, category & location
- **Track Complaints** — View all complaints with real-time status tracking
- **Filter by Category** — Water Supply, Electricity, Sanitation, Roads, Public Safety
- **Search by Location** — Find complaints in specific areas
- **Status Updates** — Update complaint status (Pending → In Progress → Resolved / Rejected)
- **Delete Complaints** — Remove resolved or invalid complaints

### 🤖 AI-Powered Analysis
- **Priority Detection** — AI classifies urgency as Critical / High / Medium / Low
- **Department Recommendation** — Suggests the most appropriate government department
- **Complaint Summarization** — Generates concise summaries of lengthy complaints
- **Auto-Response Generation** — Creates professional response messages for citizens
- **Engine** — OpenRouter AI (GPT-4o-mini)

### 🔐 Authentication & Security
- JWT-based authentication
- bcrypt password hashing
- Protected API routes
- Secure token management

### 🎨 UI/UX
- Dark / Light mode with smooth transitions
- Glassmorphism design with gradient accents
- Framer Motion animations
- Fully responsive (mobile-first)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v3, Framer Motion, Lucide Icons |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB Atlas |
| AI | OpenRouter API (GPT-4o-mini) + Local Fallback |
| Auth | JWT + bcrypt |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### 1. Clone & Install

```bash
git clone 
cd SmartComplaint-AI

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Backend - backend/.env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/smartcomplaint
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_key_here  # optional - local fallback works without it

# Frontend - frontend/.env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database

```bash
cd backend
npm run seed
```
Demo credentials: `rahul@gmail.com` / `password123`

### 4. Run Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login user |
| GET | `/api/auth/me` | ✅ | Get profile |
| POST | `/api/complaints` | ✅ | Add complaint |
| GET | `/api/complaints` | ✅ | Get all (filter: `?category=`) |
| GET | `/api/complaints/search` | ✅ | Search (`?location=`) |
| GET | `/api/complaints/:id` | ✅ | Get single |
| PUT | `/api/complaints/:id` | ✅ | Update status |
| DELETE | `/api/complaints/:id` | ✅ | Delete |
| POST | `/api/ai/analyze` | ✅ | AI analyze |

---

## 📁 Project Structure

```
SmartComplaint/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Complaint.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── aiRoutes.js
│   ├── utils/localAIFallback.js
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── index.css
│
└── README.md
```

---

## 🌐 Deployment (Render)

### Backend
1. Create **Web Service** on Render
2. Connect GitHub repo → Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add environment variables (MONGODB_URI, JWT_SECRET, OPENROUTER_API_KEY)

### Frontend
1. Create **Static Site** on Render
2. Connect GitHub repo → Root Directory: `frontend`
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`
5. Add env: `VITE_API_URL=https://your-backend.onrender.com/api`

---

## 👤 Author

**Jitesh** — B.Tech 4th Semester, AI Driven Full Stack Development (AI308B)


