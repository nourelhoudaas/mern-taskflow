// backend/controllers/authController.js
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Générer un token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
}

// @route  POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        // Vérifier si l'email existe déjà
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: '❌ Email déjà utilisé' })
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Créer l'utilisateur
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'member'
        })

        res.status(201).json({
            message: '✅ Compte créé avec succès',
            token: generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: '❌ Email ou mot de passe incorrect' })
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: '❌ Email ou mot de passe incorrect' })
        }

        res.status(200).json({
            message: '✅ Connexion réussie',
            token: generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

module.exports = { register, login, getMe }