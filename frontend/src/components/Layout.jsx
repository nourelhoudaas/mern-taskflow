// frontend/src/components/Layout.jsx
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <Sidebar />
            <main style={styles.main}>
                {children}
            </main>
        </div>
    )
}

const styles = {
    main: {
        marginLeft: '220px',
        marginTop: '60px',
        padding: '30px',
        backgroundColor: '#f0f2f5',
        minHeight: 'calc(100vh - 60px)'
    }
}

export default Layout