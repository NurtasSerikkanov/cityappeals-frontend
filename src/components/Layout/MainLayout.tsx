import { ReactNode } from 'react'
import styles from './MainLayout.module.scss'
import Sidebar from '../Sidebar/Sidebar'

const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.main}>{children}</main>
        </div>
    )
}

export default MainLayout