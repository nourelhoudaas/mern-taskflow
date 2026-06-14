// backend/controllers/taskController.js
const Task = require('../models/Task')
const Notification = require('../models/Notification')

// @route  POST /api/tasks
const createTask = async (req, res) => {
    try {
        const { title, description, priority, assignedTo, project, deadline } = req.body

        const task = await Task.create({
            title,
            description,
            priority,
            assignedTo,
            project,
            deadline,
            createdBy: req.user.id
        })

        // Créer une notification si la tâche est assignée
        if (assignedTo) {
            await Notification.create({
                userId: assignedTo,
                message: `📋 Une nouvelle tâche vous a été assignée : "${title}"`,
                type: 'assignation'
            })
        }

        res.status(201).json({ message: '✅ Tâche créée', task })
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  GET /api/tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            $or: [
                { assignedTo: req.user.id },
                { createdBy: req.user.id }
            ]
        })
            .populate('assignedTo', 'name email')
            .populate('project', 'title')
            .populate('createdBy', 'name email')

        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  GET /api/tasks/project/:projectId
const getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email')

        res.status(200).json(tasks)
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  PUT /api/tasks/:id
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.status(200).json({ message: '✅ Tâche mise à jour', task })
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  PUT /api/tasks/:id/status
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )

        res.status(200).json({ message: '✅ Statut mis à jour', task })
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: '✅ Tâche supprimée' })
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

module.exports = {
    createTask,
    getTasks,
    getTasksByProject,
    updateTask,
    updateTaskStatus,
    deleteTask
}