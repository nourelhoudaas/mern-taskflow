// backend/routes/tasks.js
const express = require('express')
const router = express.Router()
const { createTask, getTasks, getTasksByProject, updateTask, updateTaskStatus, deleteTask } = require('../controllers/taskController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.post('/', createTask)
router.get('/', getTasks)
router.get('/project/:projectId', getTasksByProject)
router.put('/:id', updateTask)
router.put('/:id/status', updateTaskStatus)
router.delete('/:id', deleteTask)

module.exports = router