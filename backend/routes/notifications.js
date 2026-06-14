// backend/routes/notifications.js
const express = require('express')
const router = express.Router()
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.get('/', getNotifications)
router.put('/readall', markAllAsRead)
router.put('/:id/read', markAsRead)

module.exports = router