// backend/routes/teams.js
const express = require('express')
const router = express.Router()
const { createTeam, getTeams, getTeamById, addMember, deleteTeam } = require('../controllers/teamController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect) // toutes les routes protégées

router.post('/', createTeam)
router.get('/', getTeams)
router.get('/:id', getTeamById)
router.put('/:id/addmember', addMember)
router.delete('/:id', deleteTeam)

module.exports = router