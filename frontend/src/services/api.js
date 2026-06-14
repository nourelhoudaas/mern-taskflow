// frontend/src/services/api.js
import axios from 'axios'

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
})

// Ajoute le token automatiquement à chaque requête
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token')
    if (token) {
        req.headers.Authorization = `Bearer ${token}`
    }
    return req
})

// AUTH
export const register = (data) => API.post('/auth/register', data)
export const login = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')

// TEAMS
export const getTeams = () => API.get('/teams')
export const createTeam = (data) => API.post('/teams', data)
export const addMember = (teamId, data) => API.put(`/teams/${teamId}/addmember`, data)
export const deleteTeam = (teamId) => API.delete(`/teams/${teamId}`)

// PROJECTS
export const getProjects = () => API.get('/projects')
export const createProject = (data) => API.post('/projects', data)
export const getProjectById = (id) => API.get(`/projects/${id}`)
export const deleteProject = (id) => API.delete(`/projects/${id}`)

// TASKS
export const getTasks = () => API.get('/tasks')
export const getTasksByProject = (projectId) => API.get(`/tasks/project/${projectId}`)
export const createTask = (data) => API.post('/tasks', data)
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data)
export const updateTaskStatus = (id, status) => API.put(`/tasks/${id}/status`, { status })
export const deleteTask = (id) => API.delete(`/tasks/${id}`)

// NOTIFICATIONS
export const getNotifications = () => API.get('/notifications')
export const markAsRead = (id) => API.put(`/notifications/${id}/read`)
export const markAllAsRead = () => API.put('/notifications/readall')