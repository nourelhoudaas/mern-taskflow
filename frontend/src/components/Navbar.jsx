// frontend/src/components/Navbar.jsx
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import NotificationBell from './NotificationBell'

const Navbar = () => {
    const { user, logoutUser } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logoutUser()
        navigate('/login')
    }

    return (
        <nav style={styles.navbar}>
            <div style={styles.logo}>🚀 TaskFlow</div>
            <div style={styles.right}>
                <NotificationBell />
                <span style={styles.username}>👤 {user?.name}</span>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                    Déconnexion
                </button>
            </div>
        </nav>
    )
}

const styles = {
    navbar: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '0 30px',
        height: '60px', backgroundColor: '#4f46e5',
        color: 'white', position: 'fixed',
        top: 0, left: 0, right: 0, zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    },
    logo: { fontSize: '22px', fontWeight: 'bold' },
    right: { display: 'flex', alignItems: 'center', gap: '20px' },
    username: { fontSize: '14px' },
    logoutBtn: {
        padding: '8px 16px', backgroundColor: 'white',
        color: '#4f46e5', border: 'none', borderRadius: '8px',
        cursor: 'pointer', fontWeight: 'bold'
    }
}

export default Navbar