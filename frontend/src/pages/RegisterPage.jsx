// frontend/src/pages/RegisterPage.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
    const [form, setForm] = useState({
        name: '', email: '', password: '', role: 'member'
    })
    const [error, setError] = useState('')
    const { loginUser } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await register(form)
            loginUser(res.data.token, res.data.user)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || '❌ Erreur inscription')
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>🚀 TaskFlow</h2>
                <h3 style={styles.subtitle}>Créer un compte</h3>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        style={styles.input}
                        type="text"
                        name="name"
                        placeholder="Nom complet"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={styles.input}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        name="password"
                        placeholder="Mot de passe"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <select
                        style={styles.input}
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                    >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button style={styles.button} type="submit">
                        S'inscrire
                    </button>
                </form>

                <p style={styles.link}>
                    Déjà un compte ? <Link to="/login">Se connecter</Link>
                </p>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex', justifyContent: 'center',
        alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5'
    },
    card: {
        background: 'white', padding: '40px', borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px'
    },
    title: { textAlign: 'center', color: '#4f46e5', marginBottom: '5px' },
    subtitle: { textAlign: 'center', color: '#333', marginBottom: '20px' },
    input: {
        width: '100%', padding: '12px', marginBottom: '15px',
        border: '1px solid #ddd', borderRadius: '8px',
        fontSize: '14px', boxSizing: 'border-box'
    },
    button: {
        width: '100%', padding: '12px', backgroundColor: '#4f46e5',
        color: 'white', border: 'none', borderRadius: '8px',
        fontSize: '16px', cursor: 'pointer'
    },
    error: { color: 'red', textAlign: 'center', marginBottom: '10px' },
    link: { textAlign: 'center', marginTop: '15px', fontSize: '14px' }
}

export default RegisterPage