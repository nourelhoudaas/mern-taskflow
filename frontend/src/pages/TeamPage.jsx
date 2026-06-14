// frontend/src/pages/TeamPage.jsx
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import {
    getTeams, createTeam,
    deleteTeam, addMember
} from '../services/api'

const TeamPage = () => {
    const [teams, setTeams] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [showAddMember, setShowAddMember] = useState(null)
    const [form, setForm] = useState({ name: '', description: '' })
    const [memberForm, setMemberForm] = useState({ userId: '' })

    useEffect(() => {
        fetchTeams()
    }, [])

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
            await createTeam(form)
            setShowForm(false)
            setForm({ name: '', description: '' })
            fetchTeams()
        } catch (err) {
            console.log(err)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cette équipe ?')) {
            await deleteTeam(id)
            fetchTeams()
        }
    }

    const handleAddMember = async (e, teamId) => {
        e.preventDefault()
        try {
            await addMember(teamId, memberForm)
            setShowAddMember(null)
            setMemberForm({ userId: '' })
            fetchTeams()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Layout>
            {/* Header */}
            <div style={styles.header}>
                <h2 style={styles.title}>👥 Mes Équipes</h2>
                <button
                    style={styles.addBtn}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '✕ Annuler' : '+ Nouvelle Équipe'}
                </button>
            </div>

            {/* Formulaire création équipe */}
            {showForm && (
                <div style={styles.formCard}>
                    <h3 style={styles.formTitle}>Créer une équipe</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            style={styles.input}
                            type="text"
                            name="name"
                            placeholder="Nom de l'équipe"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            style={styles.textarea}
                            name="description"
                            placeholder="Description de l'équipe"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                        />
                        <button style={styles.submitBtn} type="submit">
                            ✅ Créer l'équipe
                        </button>
                    </form>
                </div>
            )}

            {/* Liste des équipes */}
            {teams.length === 0 ? (
                <div style={styles.empty}>
                    <p>📭 Aucune équipe pour le moment</p>
                    <p style={styles.emptyHint}>Crée ta première équipe !</p>
                </div>
            ) : (
                <div style={styles.grid}>
                    {teams.map((team) => (
                        <div key={team._id} style={styles.card}>

                            {/* Header carte */}
                            <div style={styles.cardHeader}>
                                <div style={styles.teamIcon}>👥</div>
                                <div style={styles.cardHeaderRight}>
                                    <h3 style={styles.cardTitle}>{team.name}</h3>
                                    <span style={styles.memberCount}>
                                        {team.members?.length || 0} membre(s)
                                    </span>
                                </div>
                                <button
                                    style={styles.deleteBtn}
                                    onClick={() => handleDelete(team._id)}
                                >
                                    🗑️
                                </button>
                            </div>

                            {/* Description */}
                            <p style={styles.cardDesc}>
                                {team.description || 'Aucune description'}
                            </p>

                            {/* Liste membres */}
                            <div style={styles.membersSection}>
                                <h4 style={styles.membersTitle}>Membres :</h4>
                                <div style={styles.membersList}>
                                    {team.members?.map((member) => (
                                        <div key={member._id} style={styles.memberItem}>
                                            <div style={styles.memberAvatar}>
                                                {member.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p style={styles.memberName}>{member.name}</p>
                                                <p style={styles.memberEmail}>{member.email}</p>
                                            </div>
                                            <span style={{
                                                ...styles.roleBadge,
                                                backgroundColor: member.role === 'admin'
                                                    ? '#eef2ff' : '#f0fdf4',
                                                color: member.role === 'admin'
                                                    ? '#4f46e5' : '#059669'
                                            }}>
                                                {member.role === 'admin' ? '👑 Admin' : '👤 Member'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ajouter un membre */}
                            <button
                                style={styles.addMemberBtn}
                                onClick={() => setShowAddMember(
                                    showAddMember === team._id ? null : team._id
                                )}
                            >
                                {showAddMember === team._id
                                    ? '✕ Annuler'
                                    : '+ Ajouter un membre'}
                            </button>

                            {showAddMember === team._id && (
                                <form
                                    onSubmit={(e) => handleAddMember(e, team._id)}
                                    style={styles.addMemberForm}
                                >
                                    <input
                                        style={styles.input}
                                        type="text"
                                        placeholder="ID de l'utilisateur"
                                        value={memberForm.userId}
                                        onChange={(e) => setMemberForm({ userId: e.target.value })}
                                        required
                                    />
                                    <button style={styles.submitBtn} type="submit">
                                        ✅ Ajouter
                                    </button>
                                </form>
                            )}

                            {/* Créateur */}
                            <div style={styles.createdBy}>
                                Créé par : {team.createdBy?.name || 'Inconnu'}
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
    formTitle: { color: '#1e1b4b', margin: '0 0 15px' },
    input: {
        width: '100%', padding: '12px', marginBottom: '12px',
        border: '1px solid #ddd', borderRadius: '8px',
        fontSize: '14px', boxSizing: 'border-box'
    },
    textarea: {
        width: '100%', padding: '12px', marginBottom: '12px',
        border: '1px solid #ddd', borderRadius: '8px',
        fontSize: '14px', boxSizing: 'border-box', resize: 'vertical'
    },
    submitBtn: {
        padding: '10px 25px', backgroundColor: '#059669',
        color: 'white', border: 'none', borderRadius: '8px',
        cursor: 'pointer', fontWeight: 'bold'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px'
    },
    card: {
        backgroundColor: 'white', borderRadius: '12px',
        padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        borderTop: '4px solid #4f46e5'
    },
    cardHeader: {
        display: 'flex', alignItems: 'center',
        gap: '12px', marginBottom: '12px'
    },
    teamIcon: {
        fontSize: '32px', backgroundColor: '#eef2ff',
        borderRadius: '50%', width: '50px', height: '50px',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    cardHeaderRight: { flex: 1 },
    cardTitle: { fontSize: '16px', color: '#1e1b4b', margin: '0 0 2px' },
    memberCount: {
        fontSize: '12px', color: '#6b7280'
    },
    deleteBtn: {
        background: 'none', border: 'none',
        cursor: 'pointer', fontSize: '18px'
    },
    cardDesc: {
        fontSize: '13px', color: '#6b7280',
        marginBottom: '15px', lineHeight: '1.5'
    },
    membersSection: { marginBottom: '15px' },
    membersTitle: {
        fontSize: '13px', color: '#374151',
        margin: '0 0 10px', fontWeight: '600'
    },
    membersList: { display: 'flex', flexDirection: 'column', gap: '8px' },
    memberItem: {
        display: 'flex', alignItems: 'center',
        gap: '10px', padding: '8px',
        backgroundColor: '#f9fafb', borderRadius: '8px'
    },
    memberAvatar: {
        width: '34px', height: '34px', borderRadius: '50%',
        backgroundColor: '#4f46e5', color: 'white',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontWeight: 'bold',
        fontSize: '14px', flexShrink: 0
    },
    memberName: {
        fontSize: '13px', fontWeight: '600',
        color: '#1e1b4b', margin: 0
    },
    memberEmail: {
        fontSize: '11px', color: '#6b7280', margin: 0
    },
    roleBadge: {
        fontSize: '11px', padding: '3px 8px',
        borderRadius: '10px', marginLeft: 'auto',
        fontWeight: '500', flexShrink: 0
    },
    addMemberBtn: {
        width: '100%', padding: '8px',
        backgroundColor: '#eef2ff', color: '#4f46e5',
        border: '1px solid #c7d2fe', borderRadius: '8px',
        cursor: 'pointer', fontSize: '13px',
        fontWeight: '500', marginBottom: '10px'
    },
    addMemberForm: { marginTop: '10px' },
    createdBy: {
        fontSize: '11px', color: '#9ca3af',
        marginTop: '10px', textAlign: 'right'
    },
    empty: {
        textAlign: 'center', padding: '60px',
        color: '#6b7280', fontSize: '18px'
    },
    emptyHint: { fontSize: '14px', color: '#9ca3af' }
}

export default TeamPage