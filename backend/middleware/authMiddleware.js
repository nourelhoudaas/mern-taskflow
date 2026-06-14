// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
    let token

    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            // Récupère le token
            token = req.headers.authorization.split(' ')[1]

            // Vérifie le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Ajoute l'utilisateur à la requête
            req.user = decoded

            next()
        } catch (error) {
            res.status(401).json({ message: '❌ Token invalide' })
        }
    }

    if (!token) {
        res.status(401).json({ message: '❌ Pas de token, accès refusé' })
    }
}

// Middleware pour vérifier le rôle admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        res.status(403).json({ message: '❌ Accès réservé aux admins' })
    }
}

module.exports = { protect, adminOnly }