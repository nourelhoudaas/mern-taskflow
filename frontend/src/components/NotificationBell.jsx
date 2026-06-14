// frontend/src/components/NotificationBell.jsx
import { useState, useEffect } from 'react'
import { getNotifications, markAllAsRead } from '../services/api'

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([])
    const [open, setOpen] = useState(false)

    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        try {
            const res = await getNotifications()
            setNotifications(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const unreadCount = notifications.filter(n => !n.isRead).length

    const handleOpen = async () => {
        setOpen(!open)
        if (!open && unreadCount > 0) {
            await markAllAsRead()
            setNotifications(notifications.map(n => ({ ...n, isRead: true })))
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.bell} onClick={handleOpen}>
                🔔
                {unreadCount > 0 && (
                    <span style={styles.badge}>{unreadCount}</span>
                )}
            </div>

            {open && (
                <div style={styles.dropdown}>
                    <h4 style={styles.dropdownTitle}>Notifications</h4>
                    {notifications.length === 0 ? (
                        <p style={styles.empty}>Aucune notification</p>
                    ) : (
                        notifications.slice(0, 5).map((n) => (
                            <div key={n._id} style={{
                                ...styles.notif,
                                ...(n.isRead ? styles.read : styles.unread)
                            }}>
                                <p style={styles.notifMsg}>{n.message}</p>
                                <small style={styles.notifDate}>
                                    {new Date(n.createdAt).toLocaleDateString()}
                                </small>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

const styles = {
    container: { position: 'relative' },
    bell: {
        fontSize: '22px', cursor: 'pointer',
        position: 'relative', userSelect: 'none'
    },
    badge: {
        position: 'absolute', top: '-8px', right: '-8px',
        backgroundColor: 'red', color: 'white',
        borderRadius: '50%', width: '18px', height: '18px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: 'bold'
    },
    dropdown: {
        position: 'absolute', right: 0, top: '35px',
        backgroundColor: 'white', borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        width: '300px', zIndex: 999, overflow: 'hidden'
    },
    dropdownTitle: {
        padding: '15px 20px', margin: 0,
        borderBottom: '1px solid #eee', color: '#333'
    },
    empty: { padding: '15px 20px', color: '#999', textAlign: 'center' },
    notif: { padding: '12px 20px', borderBottom: '1px solid #f0f0f0' },
    unread: { backgroundColor: '#eef2ff' },
    read: { backgroundColor: 'white' },
    notifMsg: { margin: '0 0 4px', fontSize: '13px', color: '#333' },
    notifDate: { color: '#999', fontSize: '11px' }
}

export default NotificationBell