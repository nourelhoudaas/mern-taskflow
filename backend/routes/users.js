const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

// GET tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
})

module.exports = router