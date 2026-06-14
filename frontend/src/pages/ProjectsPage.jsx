// frontend/src/pages/ProjectsPage.jsx
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getProjects, createProject, deleteProject, getTeams } from '../services/api'

const ProjectsPage = () => {
    const [projects, setProjects] = useState([])
    const [teams, setTeams] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        title: '', description: '', team: '', members: []
    })

    useEffect(() => {
        fetchProjects()
        fetchTeams()
    }, [])

    const fetchProjects = async () => {
        try {
            const res = await getProjects()
            setProjects(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchTeams = async () => {
        try {
            const res = await getTeams()
            setTeams(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await createProject(form)
            setShowForm(false)
            setForm({ title: '', description: '', team: '', members: [] })
            fetchProjects()
        } catch (err) {
            console.log(err)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce projet ?')) {
            await deleteProject(id)
            fetchProjects()
        }
    }

    const priorityColor = {
        'todo': '#6b7280',
        'inprogress': '#3b82f6',
        'done': '#10b981'
    }

    return (
        <Layout>
            <div style={styles.header}>
                <h2 style={styles.title}>📁 Mes Projets</h2>
                <button
                    style={styles.addBtn}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '✕ Annuler' : '+ Nouveau Projet'}
                </button>
            </div>

            {/* Formulaire création */}
            {showForm && (
                <div style={styles.formCard}>
                    <h3 style={styles.formTitle}>Créer un projet</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            style={styles.input}
                            type="text"
                            name="title"
                            placeholder="Titre du projet"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            style={styles.textarea}
                            name="description"
                            placeholder="Description du projet"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                        />
                        <select
                            style={styles.input}
                            name="team"
                            value={form.team}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Sélectionner une équipe</option>
                            {teams.map(team => (
                                <option key={team._id} value={team._id}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
                        <button style={styles.submitBtn} type="submit">
                            ✅ Créer le projet
                        </button>
                    </form>
                </div>
            )}

            {/* Liste des projets */}
            {projects.length === 0 ? (
                <div style={styles.empty}>
                    <p>📭 Aucun projet pour le moment</p>
                    <p style={styles.emptyHint}>Crée ton premier projet !</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {projects.map((project) => (
                        <div key={project._id} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}>{project.title}</h3>
                                <button
                                    style={styles.deleteBtn}
                                    onClick={() => handleDelete(project._id)}
                                >
                                    🗑️
                                </button>
                            </div>
                            <p style={styles.cardDesc}>
                                {project.description || 'Aucune description'}
                            </p>
                            <div style={styles.cardFooter}>
                                <span style={styles.teamBadge}>
                                    👥 {project.team?.name || 'Équipe'}
                                </span>
                                <span style={styles.membersBadge}>
                                    👤 {project.members?.length || 0} membres
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    )
}

const styles = {
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '25px'
    },
    title: { fontSize: '24px', color: '#1e1b4b', margin: 0 },
    addBtn: {
        padding: '10px 20px', backgroundColor: '#4f46e5',
        color: 'white', border: 'none', borderRadius: '8px',
        cursor: 'pointer', fontWeight: 'bold'
    },
    formCard: {
        backgroundColor: 'white', padding: '25px',
        borderRadius: '12px', marginBottom: '25px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
    },
    formTitle: { color: '#1e1b4b', marginBottom: '15px' },
    input: {
        width: '100%', padding: '12px', marginBottom: '15px',
        border: '1px solid #ddd', borderRadius: '8px',
        fontSize: '14px', boxSizing: 'border-box'
    },
    textarea: {
        width: '100%', padding: '12px', marginBottom: '15px',
        border: '1px solid #ddd', borderRadius: '8px',
        fontSize: '14px', boxSizing: 'border-box', resize: 'vertical'
    },
    submitBtn: {
        padding: '10px 25px', backgroundColor: '#059669',
        color: 'white', border: 'none', borderRadius: '8px',
        cursor: 'pointer', fontWeight: 'bold'
    },
    grid: {
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px'
    },
    card: {
        backgroundColor: 'white', borderRadius: '12px',
        padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        borderTop: '4px solid #4f46e5'
    },
    cardHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '10px'
    },
    cardTitle: { fontSize: '16px', color: '#1e1b4b', margin: 0 },
    deleteBtn: {
        background: 'none', border: 'none',
        cursor: 'pointer', fontSize: '16px'
    },
    cardDesc: { fontSize: '13px', color: '#6b7280', marginBottom: '15px' },
    cardFooter: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
    teamBadge: {
        fontSize: '12px', backgroundColor: '#eef2ff',
        color: '#4f46e5', padding: '4px 10px', borderRadius: '20px'
    },
    membersBadge: {
        fontSize: '12px', backgroundColor: '#f0fdf4',
        color: '#059669', padding: '4px 10px', borderRadius: '20px'
    },
    empty: {
        textAlign: 'center', padding: '60px',
        color: '#6b7280', fontSize: '18px'
    },
    emptyHint: { fontSize: '14px', color: '#9ca3af' }
}

export default ProjectsPage