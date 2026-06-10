# TaskFlow — Manage your tasks & teams 🚀
 
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Status](https://img.shields.io/badge/Status-In%20Progress-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
 
## 📋 Project Description
 
**TaskFlow** is a full-stack MERN web application designed to help teams and individuals organize, assign, and track their tasks efficiently.
 
It solves the common problem of disorganized teamwork and missed deadlines by providing a centralized platform where every team member knows **what to do**, **when to do it**, and **who is responsible**.
 
---
 
## ✨ Features
 
- 🔐 **Authentication & Authorization** — Secure login/register with JWT + Role-based access (Admin / Member)
- 👥 **Team Management** — Create teams, invite members, assign roles
- 📁 **Project Management** — Create projects and assign them to teams
- ✅ **Task Management** — Create tasks, set priorities (Low / Medium / High), assign to members, set deadlines
- 📊 **Kanban Board** — Visual drag & drop board with columns: To Do / In Progress / Done
- 🔔 **Notifications** — Get notified when a task is assigned or a deadline is approaching
- 📱 **Responsive Design** — Works on all devices
---
 
## 🛠️ Tech Stack
 
### Frontend
- React.js
- Context API (State Management)
- Axios (API calls)
- TailwindCSS / Bootstrap (Styling)
- react-beautiful-dnd (Drag & Drop Kanban)
### Backend
- Node.js
- Express.js
- JWT (Authentication)
- Mongoose (MongoDB ODM)
### Database
- MongoDB Atlas (Cloud Database)
### Deployment
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas
---
 
## 🗂️ Project Structure
 
```
taskflow/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic
│   ├── middleware/      # JWT verification & roles
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   └── server.js
│
└── frontend/
    ├── public/
    └── src/
        ├── components/  # Reusable UI components
        ├── context/     # Global state (AuthContext)
        ├── pages/       # App pages
        ├── services/    # Axios API calls
        └── App.jsx
```
 
---
 
## 🗄️ Database Schema
 
| Collection | Key Fields |
|------------|-----------|
| **Users** | name, email, password, role, avatar |
| **Teams** | name, description, members[], createdBy |
| **Projects** | title, description, team, members[] |
| **Tasks** | title, status, priority, assignedTo, deadline |
| **Notifications** | userId, message, isRead, type |
 
---
 
## 🚀 Getting Started
 
### Prerequisites
- Node.js installed
- MongoDB Atlas account
- npm or yarn
### Installation
 
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/mern-taskflow.git
 
# Install backend dependencies
cd backend
npm install
 
# Install frontend dependencies
cd ../frontend
npm install
```
 
### Environment Variables
 
Create a `.env` file in the `backend/` folder:
 
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```
 
### Run the app
 
```bash
# Run backend (from /backend)
npm run dev
 
# Run frontend (from /frontend)
npm start
```
 
---
 
## 📅 Project Sprints (Scrum Methodology)
 
| Sprint | Duration | Goal |
|--------|----------|------|
| Sprint 1 | Week 1 | Project setup + Authentication (JWT) |
| Sprint 2 | Week 2 | Teams + Projects + Tasks CRUD (Backend) |
| Sprint 3 | Week 3 | Frontend — Dashboard + Kanban Board |
| Sprint 4 | Week 4 | Notifications + Roles + Testing + Deployment |
 
---
 
## 👩‍💻 Author
 
Made with ❤️ as a Final Bootcamp Project
