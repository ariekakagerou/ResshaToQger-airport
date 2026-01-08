"use client";
import { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import styles from '@/components/admin/Admin.module.css';

export default function AdminLayout({ children }) {
    const [theme, setTheme] = useState('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('admin-theme');
        if (savedTheme) {
            setTheme(savedTheme);
        }
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('admin-theme', newTheme);
    };

    if (!mounted) return <div className={styles.adminLayout} style={{ background: '#0b1121' }} />; // Better loading state

    return (
        <div className={styles.adminLayout} data-theme={theme}>
            <Sidebar />
            <div className={styles.mainContent}>
                <Header theme={theme} toggleTheme={toggleTheme} />
                <main className={styles.contentScroll}>
                    {children}
                </main>
            </div>
        </div>
    );
}
