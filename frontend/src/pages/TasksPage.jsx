// frontend/src/pages/TasksPage.jsx
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import {
    getTasks, createTask, deleteTask,
    updateTaskStatus, getProjects
} from '../services/api'

const TasksPage = () => {
    const [tasks, setTasks] = useState([])
    const [projects, setProjects] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState('all')
    const [form, setForm] = useState({
        title: '', description: '', priority: 'medium',
        project: '', deadline: '', assignedTo: ''
    })

    useEffect(() => {
        fetchTasks()
        fetchProjects()
    }, [])

    const fetchTasks = async () => {
        try {
            const res = await getTasks()
            setTasks(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchProjects = async () => {
        try {
            const res = await getProjects()
            setProjects(res.data)
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
            await createTask(form)
            setShowForm(false)
            setForm({
                title: '', description: '', priority: 'medium',
                project: '', deadline: '', assignedTo: ''
            })
            fetchTasks()
        } catch (err) {
            console.log(err)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cette tâche ?')) {
            await deleteTask(id)
            fetchTasks()
        }
    }

    const handleStatusChange = async (id, status) => {
        await updateTaskStatus(id, status)
        fetchTasks()
    }

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true
        return task.status === filter
    })

    const priorityColor = {
        low: '#10b981', medium: '#f59e0b', high: '#ef4444'
    }

    const priorityLabel = {
        low: 'Faible', medium: 'Moyenne', high: 'Haute'
    }

    const statusLabel = {
        todo: '📋 À faire',
        inprogress: '🔄 En cours',
        done: '✅ Terminé'
    }

    return (
        <Layout>
            <div style={styles.header}>
                <h2 style={styles.title}>✅ Mes Tâches</h2>
                <button
                    style={styles.addBtn}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '✕ Annuler' : '+ Nouvelle Tâche'}
                </button>
            </div>

            {/* Formulaire création */}
            {showForm && (
                <div style={styles.formCard}>
                    <h3 style={styles.formTitle}>Créer une tâche</h3>
                    <form onSubmit={handleSubmit}>
                        <input
                            style={styles.input}
                            type="text"
                            name="title"
                            placeholder="Titre de la tâche"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            style={styles.textarea}
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                        />
                        <div style={styles.row}>
                            <select
                                style={styles.inputHalf}
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                            >
                                <option value="low">🟢 Priorité faible</option>
                                <option value="medium">🟡 Priorité moyenne</option>
                                <option value="high">🔴 Priorité haute</option>
                            </select>
                            <select
                                style={styles.inputHalf}
                                name="project"
                                value={form.project}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Sélectionner un projet</option>
                                {projects.map(p => (
                                    <option key={p._id} value={p._id}>{p.title}</option>
                                ))}
                            </select>
                        </div>
                        <input
                            style={styles.input}
                            type="date"
                            name="deadline"
                            value={form.deadline}
                            onChange={handleChange}
                        />
                        <button style={styles.submitBtn} type="submit">
                            ✅ Créer la tâche
                        </button>
                    </form>
                </div>
            )}

            {/* Filtres */}
            <div style={styles.filters}>
                {['all', 'todo', 'inprogress', 'done'].map(f => (
                    <button
                        key={f}
                        style={{
                            ...styles.filterBtn,
                            ...(filter === f ? styles.filterActive : {})
                        }}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? '🔍 Toutes' : statusLabel[f]}
                    </button>
                ))}
            </div>

            {/* Liste des tâches */}
            {filteredTasks.length === 0 ? (
                <div style={styles.empty}>
                    <p>📭 Aucune tâche trouvée</p>
                </div>
            ) : (
                <div style={styles.taskList}>
                    {filteredTasks.map((task) => (
                        <div key={task._id} style={styles.taskCard}>
                            <div style={styles.taskLeft}>
                                <div style={{
                                    ...styles.priorityDot,
                                    backgroundColor: priorityColor[task.priority]
                                }} />
                                <div>
                                    <h4 style={styles.taskTitle}>{task.title}</h4>
                                    <p style={styles.taskDesc}>
                                        {task.description || 'Aucune description'}
                                    </p>
                                    <div style={styles.taskMeta}>
                                        {task.deadline && (
                                            <span style={styles.deadline}>
                                                📅 {new Date(task.deadline).toLocaleDateString()}
                                            </span>
                                        )}
                                        {task.project && (
                                            <span style={styles.projectBadge}>
                                                📁 {task.project?.title}
                                            </span>
                                        )}
                                        <span style={{
                                            ...styles.priorityBadge,
                                            backgroundColor: priorityColor[task.priority] + '20',
                                            color: priorityColor[task.priority]
                                        }}>
                                            {priorityLabel[task.priority]}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={styles.taskRight}>
                                <select
                                    style={styles.statusSelect}
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                >
                                    <option value="todo">📋 À faire</option>
                                    <option value="inprogress">🔄 En cours</option>
                                    <option value="done">✅ Terminé</option>
                                </select>
                                <button
                                    style={styles.deleteBtn}
                                    onClick={() => handleDelete(task._id)}
                                >
                                    🗑️
                                </button>
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
    row: { display: 'flex', gap: '15px', marginBottom: '0' },
    inputHalf: {
        flex: 1, padding: '12px', marginBottom: '15px',
        border: '1px solid #ddd', borderRadius: '8px',
        fontSize: '14px', boxSizing: 'border-box'
    },
    submitBtn: {
        padding: '10px 25px', backgroundColor: '#059669',
        color: 'white', border: 'none', borderRadius: '8px',
        cursor: 'pointer', fontWeight: 'bold'
    },
    filters: {
        display: 'flex', gap: '10px', marginBottom: '20px'
    },
    filterBtn: {
        padding: '8px 16px', backgroundColor: 'white',
        border: '1px solid #ddd', borderRadius: '20px',
        cursor: 'pointer', fontSize: '13px', color: '#6b7280'
    },
    filterActive: {
        backgroundColor: '#4f46e5', color: 'white',
        border: '1px solid #4f46e5', fontWeight: 'bold'
    },
    taskList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    taskCard: {
        backgroundColor: 'white', borderRadius: '12px',
        padding: '18px 20px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
    },
    taskLeft: { display: 'flex', alignItems: 'flex-start', gap: '15px' },
    priorityDot: {
        width: '12px', height: '12px', borderRadius: '50%',
        marginTop: '5px', flexShrink: 0
    },
    taskTitle: { fontSize: '15px', color: '#1e1b4b', margin: '0 0 4px' },
    taskDesc: { fontSize: '13px', color: '#6b7280', margin: '0 0 8px' },
    taskMeta: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    deadline: {
        fontSize: '12px', color: '#ef4444',
        backgroundColor: '#fef2f2', padding: '3px 8px', borderRadius: '10px'
    },
    projectBadge: {
        fontSize: '12px', color: '#4f46e5',
        backgroundColor: '#eef2ff', padding: '3px 8px', borderRadius: '10px'
    },
    priorityBadge: {
        fontSize: '12px', padding: '3px 8px', borderRadius: '10px'
    },
    taskRight: { display: 'flex', alignItems: 'center', gap: '10px' },
    statusSelect: {
        padding: '8px 12px', border: '1px solid #ddd',
        borderRadius: '8px', fontSize: '13px',
        cursor: 'pointer', backgroundColor: 'white'
    },
    deleteBtn: {
        background: 'none', border: 'none',
        cursor: 'pointer', fontSize: '18px'
    },
    empty: {
        textAlign: 'center', padding: '60px',
        color: '#6b7280', fontSize: '18px'
    }
}

export default TasksPage