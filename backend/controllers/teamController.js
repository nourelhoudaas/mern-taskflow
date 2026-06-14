// backend/controllers/teamController.js
const Team = require('../models/Team')

// @route  POST /api/teams
const createTeam = async (req, res) => {
    try {
        const { name, description } = req.body

        const team = await Team.create({
            name,
            description,
            members: [req.user.id],
            createdBy: req.user.id
        })

        res.status(201).json({ message: '✅ Équipe créée', team })
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  GET /api/teams
const getTeams = async (req, res) => {
    try {
        const teams = await Team.find({
            members: req.user.id
        })
            .populate('members', 'name email role')
            .populate('createdBy', 'name email')

        res.status(200).json(teams)
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  GET /api/teams/:id
const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate('members', 'name email role')
            .populate('createdBy', 'name email')

        if (!team) {
            return res.status(404).json({ message: '❌ Équipe non trouvée' })
        }

        res.status(200).json(team)
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  PUT /api/teams/:id/addmember
const addMember = async (req, res) => {
    try {
        const { userId } = req.body

        const team = await Team.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { members: userId } },
            { new: true }
        ).populate('members', 'name email role')

        res.status(200).json({ message: '✅ Membre ajouté', team })
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  DELETE /api/teams/:id
const deleteTeam = async (req, res) => {
    try {
        await Team.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: '✅ Équipe supprimée' })
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

module.exports = { createTeam, getTeams, getTeamById, addMember, deleteTeam }