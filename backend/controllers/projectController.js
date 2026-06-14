// backend/controllers/projectController.js
const Project = require('../models/Project')

// @route  POST /api/projects
const createProject = async (req, res) => {
    try {
        const { title, description, team, members } = req.body

        const project = await Project.create({
            title,
            description,
            team,
            members,
            createdBy: req.user.id
        })

        res.status(201).json({ message: '✅ Projet créé', project })
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  GET /api/projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            members: req.user.id
        })
            .populate('team', 'name')
            .populate('members', 'name email')
            .populate('createdBy', 'name email')

        res.status(200).json(projects)
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  GET /api/projects/:id
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('team', 'name')
            .populate('members', 'name email')
            .populate('createdBy', 'name email')

        if (!project) {
            return res.status(404).json({ message: '❌ Projet non trouvé' })
        }

        res.status(200).json(project)
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  PUT /api/projects/:id
const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )

        res.status(200).json({ message: '✅ Projet mis à jour', project })
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  DELETE /api/projects/:id
const deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: '✅ Projet supprimé' })
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
}