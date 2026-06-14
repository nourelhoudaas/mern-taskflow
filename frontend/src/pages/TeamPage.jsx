// frontend/src/pages/KanbanPage.jsx
import { useState, useEffect } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
import Layout from '../components/Layout'
import TaskCard from '../components/TaskCard'
import {
    getTasks, updateTaskStatus,
    deleteTask, createTask, getProjects
} from '../services/api'

const columns = [
    {
        id: 'todo',
        title: '📋 À Faire',
        color: '#6b7280',
        bg: '#f9fafb'
    },
    {
        id: 'inprogress',
        title: '🔄 En Cours',
        color: '#3b82f6',
        bg: '#eff6ff'
    },
    {
        id: 'done',
        title: '✅ Terminé',
        color: '#10b981',
        bg: '#f0fdf4'
    }
]

const KanbanPage = () => {
    const [tasks, setTasks] = useState([])
    const [projects, setProjects] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
        title: '', description: '',
        priority: 'medium', project: '',
        deadline: '', status: 'todo'
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

    // Drag & Drop handler
    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result

        // Pas de destination = annulé
        if (!destination) return

        // Même colonne même position = rien
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return

        // Nouveau statut = l'id de la colonne destination
        const newStatus = destination.droppableId

        // Mise à jour optimiste (UI immédiate)
        setTasks(prev =>
            prev.map(task =>
                task._id === draggableId
                    ? { ...task, status: newStatus }
                    : task
            )
        )

        // Mise à jour en BDD
        try {
            await updateTaskStatus(draggableId, newStatus)
        } catch (err) {
            console.log(err)
            fetchTasks() // Recharge si erreur
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cette tâche ?')) {
            await deleteTask(id)
            fetchTasks()
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
                title: '', description: '',
                priority: 'medium', project: '',
                deadline: '', status: 'todo'
            })
            fetchTasks()
        } catch (err) {
            console.log(err)
        }
    }

    // Filtre les tâches par colonne
    const getTasksByStatus = (status) =>
        tasks.filter(task => task.status === status)

    return (
        <Layout>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>📊 Kanban Board</h2>
                    <p style={styles.subtitle}>
                        Glisse les cartes pour changer leur statut
                    </p>
                </div>
                <button
                    style={styles.addBtn}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '✕ Annuler' : '+ Nouvelle Tâche'}
                </button>
            </div>

            {/* Formulaire */}
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
                            placeholder="Description (optionnel)"
                            value={form.description}
                            onChange={handleChange}
                            rows={2}
                        />
                        <div style={styles.row}>
                            <select
                                style={styles.inputHalf}
                                name="priority"
                                value={form.priority}
                                onChange={handleChange}
                            >
                                <option value="low">🟢 Faible</option>
                                <option value="medium">🟡 Moyenne</option>
                                <option value="high">🔴 Haute</option>
                            </select>
                            <select
                                style={styles.inputHalf}
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >
                                <option value="todo">📋 À Faire</option>
                                <option value="inprogress">🔄 En Cours</option>
                                <option value="done">✅ Terminé</option>
                            </select>
                        </div>
                        <div style={styles.row}>
                            <select
                                style={styles.inputHalf}
                                name="project"
                                value={form.project}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Sélectionner un projet</option>
                                {projects.map(p => (
                                    <option key={p._id} value={p._id}>
                                        {p.title}
                                    </option>
                                ))}
                            </select>
                            <input
                                style={styles.inputHalf}
                                type="date"
                                name="deadline"
                                value={form.deadline}
                                onChange={handleChange}
                            />
                        </div>
                        <button style={styles.submitBtn} type="submit">
                            ✅ Créer
                        </button>
                    </form>
                </div>
            )}

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={styles.board}>
                    {columns.map((column) => {
                        const columnTasks = getTasksByStatus(column.id)
                        return (
                            <div key={column.id} style={styles.column}>
                                {/* Header colonne */}
                                <div style={{
                                    ...styles.columnHeader,
                                    borderBottom: `3px solid ${column.color}`
                                }}>
                                    <span style={styles.columnTitle}>{column.title}</span>
                                    <span style={{
                                        ...styles.columnCount,
                                        backgroundColor: column.color + '20',
                                        color: column.color
                                    }}>
                                        {columnTasks.length}
                                    </span>
                                </div>

                                {/* Zone droppable */}
                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            style={{
                                                ...styles.droppable,
                                                backgroundColor: snapshot.isDraggingOver
                                                    ? column.color + '15'
                                                    : column.bg,
                                                minHeight: snapshot.isDraggingOver ? '200px' : '150px'
                                            }}
                                        >
                                            {columnTasks.length === 0 && (
                                                <div style={styles.emptyCol}>
                                                    Glisse une tâche ici
                                                </div>
                                            )}
                                            {columnTasks.map((task, index) => (
                                                <TaskCard
                                                    key={task._id}
                                                    task={task}
                                                    index={index}
                                                    onDelete={handleDelete}
                                                />
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        )
                    })}
                </div>
            </DragDropContext>
        </Layout>
    )
}

const styles = {
    header: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: '25px'
    },
    title: { fontSize: '24px', color: '#1e1b4b', margin: '0 0 5px' },
    subtitle: { color: '#6b7280', fontSize: '13px', margin: 0 },
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
    formTitle: { color: '#1e1b4b', marginBottom: '15px', margin: '0 0 15px' },
    input: {
        width: '100%', padding: '10px 12px', marginBottom: '12px',
        border: '1px solid #ddd', borderRadius: '8px',
        fontSize: '14px', boxSizing: 'border-box'
    },
    textarea: {
        width: '100%', padding: '10px 12px', marginBottom: '12px',
        border: '1px solid #ddd', borderRadius: '8px',
        fontSize: '14px', boxSizing: 'border-box', resize: 'vertical'
    },
    row: { display: 'flex', gap: '12px' },
    inputHalf: {
        flex: 1, padding: '10px 12px', marginBottom: '12px',
        border: '1px solid #ddd', borderRadius: '8px',
        fontSize: '14px', boxSizing: 'border-box'
    },
    submitBtn: {
        padding: '10px 25px', backgroundColor: '#059669',
        color: 'white', border: 'none', borderRadius: '8px',
        cursor: 'pointer', fontWeight: 'bold'
    },
    board: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        alignItems: 'start'
    },
    column: {
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
    },
    columnHeader: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '15px 16px',
        backgroundColor: 'white'
    },
    columnTitle: {
        fontWeight: '600', fontSize: '14px', color: '#1e1b4b'
    },
    columnCount: {
        width: '24px', height: '24px', borderRadius: '50%',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '12px', fontWeight: 'bold'
    },
    droppable: {
        padding: '12px',
        minHeight: '150px',
        transition: 'background-color 0.2s, min-height 0.2s'
    },
    emptyCol: {
        textAlign: 'center', padding: '30px 10px',
        color: '#9ca3af', fontSize: '13px',
        border: '2px dashed #e5e7eb',
        borderRadius: '8px'
    }
}

export default KanbanPage