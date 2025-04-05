import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.scss';
const Sidebar = () => {
    const { pathname } = useLocation();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.title}>Анализ города</div>
            <nav>
                <Link to="/" className={pathname === '/' ? styles.active : ''}>📊 Аналитика</Link>
                <Link to="/map" className={pathname === '/map' ? styles.active : ''}>🗺️ Геоаналитика</Link>
                <Link to="/appeals" className={pathname === '/appeals' ? styles.active : ''}>🧾 Все обращения</Link>
                <Link to="/districts-map" className={pathname === '/districts-map' ? styles.active : ''}>🗺️ Районы</Link>
                <Link to="/about" className={pathname === '/about' ? styles.active : ''}>ℹ️ О проекте</Link>
            </nav>
        </aside>
    );
};

export default Sidebar;
