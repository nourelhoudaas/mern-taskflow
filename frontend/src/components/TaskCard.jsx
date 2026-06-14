// frontend/src/components/TaskCard.jsx
import { Draggable } from '@hello-pangea/dnd'

const priorityColor = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444'
}

const priorityLabel = {
    low: '🟢 Faible',
    medium: '🟡 Moyenne',
    high: '🔴 Haute'
}

const TaskCard = ({ task, index, onDelete }) => {
    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...styles.card,
                        boxShadow: snapshot.isDragging
                            ? '0 8px 25px rgba(79,70,229,0.3)'
                            : '0 2px 8px rgba(0,0,0,0.08)',
                        transform: snapshot.isDragging
                            ? 'rotate(2deg)'
                            : 'rotate(0deg)',
                        ...provided.draggableProps.style
                    }}
                >
                    {/* Priorité */}
                    <div style={{
                        ...styles.priorityBar,
                        backgroundColor: priorityColor[task.priority]
                    }} />

                    {/* Contenu */}
                    <div style={styles.content}>
                        <h4 style={styles.title}>{task.title}</h4>

                        {task.description && (
                            <p style={styles.desc}>{task.description}</p>
                        )}

                        <div style={styles.meta}>
                            {/* Badge priorité */}
                            <span style={{
                                ...styles.badge,
                                backgroundColor: priorityColor[task.priority] + '20',
                                color: priorityColor[task.priority]
                            }}>
                                {priorityLabel[task.priority]}
                            </span>

                            {/* Deadline */}
                            {task.deadline && (
                                <span style={styles.deadline}>
                                    📅 {new Date(task.deadline).toLocaleDateString()}
                                </span>
                            )}
                        </div>

                        {/* Assigné à */}
                        {task.assignedTo && (
                            <div style={styles.assignee}>
                                👤 {task.assignedTo?.name || 'Assigné'}
                            </div>
                        )}

                        {/* Projet */}
                        {task.project && (
                            <div style={styles.project}>
                                📁 {task.project?.title}
                            </div>
                        )}

                        {/* Bouton supprimer */}
                        <button
                            style={styles.deleteBtn}
                            onClick={() => onDelete(task._id)}
                        >
                            🗑️ Supprimer
                        </button>
                    </div>
                </div>
            )}
        </Draggable>
    )
}

const styles = {
    card: {
        backgroundColor: 'white',
        borderRadius: '10px',
        marginBottom: '12px',
        overflow: 'hidden',
        cursor: 'grab',
        transition: 'box-shadow 0.2s, transform 0.2s'
    },
    priorityBar: {
        height: '4px',
        width: '100%'
    },
    content: {
        padding: '14px'
    },
    title: {
        fontSize: '14px', fontWeight: '600',
        color: '#1e1b4b', margin: '0 0 6px'
    },
    desc: {
        fontSize: '12px', color: '#6b7280',
        margin: '0 0 10px', lineHeight: '1.4'
    },
    meta: {
        display: 'flex', gap: '6px',
        flexWrap: 'wrap', marginBottom: '8px'
    },
    badge: {
        fontSize: '11px', padding: '3px 8px',
        borderRadius: '10px', fontWeight: '500'
    },
    deadline: {
        fontSize: '11px', color: '#ef4444',
        backgroundColor: '#fef2f2',
        padding: '3px 8px', borderRadius: '10px'
    },
    assignee: {
        fontSize: '12px', color: '#4f46e5',
        marginBottom: '4px'
    },
    project: {
        fontSize: '12px', color: '#059669',
        marginBottom: '10px'
    },
    deleteBtn: {
        width: '100%', padding: '6px',
        backgroundColor: '#fef2f2', color: '#ef4444',
        border: '1px solid #fecaca', borderRadius: '6px',
        cursor: 'pointer', fontSize: '12px',
        marginTop: '4px'
    }
}

export default TaskCard