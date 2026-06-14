// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProjectsPage from './pages/ProjectsPage'
import TasksPage from './pages/TasksPage'
import KanbanPage from './pages/KanbanPage'
import TeamPage from './pages/TeamPage'

// Route protégée
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div>Chargement...</div>
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes protégées */}
          <Route path="/" element={
            <PrivateRoute><DashboardPage /></PrivateRoute>
          } />
          <Route path="/projects" element={
            <PrivateRoute><ProjectsPage /></PrivateRoute>
          } />
          <Route path="/tasks" element={
            <PrivateRoute><TasksPage /></PrivateRoute>
          } />
          <Route path="/kanban" element={
            <PrivateRoute><KanbanPage /></PrivateRoute>
          } />
          <Route path="/team" element={
            <PrivateRoute><TeamPage /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App