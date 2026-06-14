// frontend/src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getTasks, getProjects, getTeams } from '../services/api'
import { useAuth } from '../context/AuthContext'

const DashboardPage = () => {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        tasks: 0, projects: 0, teams: 0,
        todo: 0, inprogress: 0, done: 0
    })

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const [tasksRes, projectsRes, teamsRes] = await Promise.all([
                getTasks(), getProjects(), getTeams()
            ])

            const tasks = tasksRes.data
            setStats({
                tasks: tasks.length,
                projects: projectsRes.data.length,
                teams: teamsRes.data.length,
                todo: tasks.filter(t => t.status === 'todo').length,
                inprogress: tasks.filter(t => t.status === 'inprogress').length,
                done: tasks.filter(t => t.status === 'done').length
            })
        } catch (err) {
            console.log(err)
        }
    }

    const cards = [
        { label: 'Mes Tâches', value: stats.tasks, color: '#4f46e5', icon: '✅' },
        { label: 'Projets', value: stats.projects, color: '#059669', icon: '📁' },
        { label: 'Équipes', value: stats.teams, color: '#d97706', icon: '👥' },
    ]

    const statusCards = [
        { label: 'À faire', value: stats.todo, color: '#6b7280', icon: '📋' },
        { label: 'En cours', value: stats.inprogress, color: '#3b82f6', icon: '🔄' },
        { label: 'Terminé', value: stats.done, color: '#10b981', icon: '🎉' },
    ]

    return (
        <Layout>
            <h2 style={styles.welcome}>
                Bonjour, {user?.name} 👋
            </h2>
            <p style={styles.subtitle}>
                Voici un aperçu de votre activité
            </p>

            {/* Stats principales */}
            <div style={styles.grid}>
                {cards.map((card) => (
                    <div key={card.label} style={{
                        ...styles.card,
                        borderTop: `4px solid ${card.color}`
                    }}>
                        <div style={styles.cardIcon}>{card.icon}</div>
                        <div style={styles.cardValue}>{card.value}</div>
                        <div style={styles.cardLabel}>{card.label}</div>
                    </div>
                ))}
            </div>

            {/* Statut des tâches */}
            <h3 style={styles.sectionTitle}>📊 Statut des tâches</h3>
            <div style={styles.grid}>
                {statusCards.map((card) => (
                    <div key={card.label} style={{
                        ...styles.card,
                        borderTop: `4px solid ${card.color}`
                    }}>
                        <div style={styles.cardIcon}>{card.icon}</div>
                        <div style={styles.cardValue}>{card.value}</div>
                        <div style={styles.cardLabel}>{card.label}</div>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

const styles = {
    welcome: { fontSize: '26px', color: '#1e1b4b', marginBottom: '5px' },
    subtitle: { color: '#6b7280', marginBottom: '30px' },
    grid: {
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px', marginBottom: '30px'
    },
    card: {
        backgroundColor: 'white', borderRadius: '12px',
        padding: '25px', textAlign: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
    },
    cardIcon: { fontSize: '32px', marginBottom: '10px' },
    cardValue: { fontSize: '36px', fontWeight: 'bold', color: '#1e1b4b' },
    cardLabel: { fontSize: '14px', color: '#6b7280', marginTop: '5px' },
    sectionTitle: { color: '#1e1b4b', marginBottom: '20px' }
}

export default DashboardPage