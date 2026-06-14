// backend/controllers/notificationController.js
const Notification = require('../models/Notification')

// @route  GET /api/notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            userId: req.user.id
        }).sort({ createdAt: -1 })

        res.status(200).json(notifications)
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true }
        )

        res.status(200).json({ message: '✅ Notification lue' })
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

// @route  PUT /api/notifications/readall
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id },
            { isRead: true }
        )

        res.status(200).json({ message: '✅ Toutes les notifications lues' })
    } catch (error) {
        res.status(500).json({ message: '❌ Erreur serveur', error: error.message })
    }
}

module.exports = { getNotifications, markAsRead, markAllAsRead }