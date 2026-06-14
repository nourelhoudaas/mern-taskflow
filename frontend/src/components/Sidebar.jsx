// frontend/src/components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
    const location = useLocation()

    const links = [
        { path: '/', label: '🏠 Dashboard' },
        { path: '/projects', label: '📁 Projets' },
        { path: '/tasks', label: '✅ Tâches' },
        { path: '/kanban', label: '📊 Kanban' },
        { path: '/team', label: '👥 Équipe' },
    ]

    return (
        <aside style={styles.sidebar}>
            {links.map((link) => (
                <Link
                    key={link.path}
                    to={link.path}
                    style={{
                        ...styles.link,
                        ...(location.pathname === link.path ? styles.activeLink : {})
                    }}
                >
                    {link.label}
                </Link>
            ))}
        </aside>
    )
}

const styles = {
    sidebar: {
        position: 'fixed', top: '60px', left: 0,
        width: '220px', height: 'calc(100vh - 60px)',
        backgroundColor: '#1e1b4b', padding: '20px 0',
        display: 'flex', flexDirection: 'column', gap: '5px'
    },
    link: {
        padding: '12px 25px', color: '#a5b4fc',
        textDecoration: 'none', fontSize: '15px',
        borderRadius: '8px', margin: '0 10px',
        transition: 'all 0.2s'
    },
    activeLink: {
        backgroundColor: '#4f46e5',
        color: 'white', fontWeight: 'bold'
    }
}

export default Sidebar