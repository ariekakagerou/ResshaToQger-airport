"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Admin.module.css';

export default function Sidebar() {
    const pathname = usePathname();
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            const token = localStorage.getItem('token');
            const storedRole = localStorage.getItem('user_role');
            if (storedRole) setRole(storedRole);

            if (!token) return;

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
                const res = await fetch(`${apiUrl}/user`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setRole(data.role);
                    localStorage.setItem('user_role', data.role);
                }
            } catch (e) {
                console.error("Failed to fetch user role", e);
            }
        };
        fetchUserRole();
    }, []);

    const menuItems = [
        {
            name: 'Dashboard',
            path: '/admin',
            icon: <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />,
            allowed: ['super_admin', 'admin', 'operator', 'cs']
        },
        {
            name: 'Data Bandara',
            path: '/admin/bandara',
            icon: <path d="M2.5 19h19v2h-19zm16.84-3.15c.8.21 1.62-.26 1.84-1.06.21-.8-.26-1.62-1.06-1.84l-5.31-1.42-2.76-9.02L10.12 2v8.28L5.15 8.95l-.93-2.32-1.45-.39v5.17l16.57 4.44z" />,
            allowed: ['super_admin', 'admin', 'operator']
        },
        {
            name: 'Data Penerbangan',
            path: '/admin/penerbangan',
            icon: <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />,
            allowed: ['super_admin', 'admin', 'operator', 'cs']
        },
        {
            name: 'Jadwal Penerbangan',
            path: '/admin/jadwal',
            icon: <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />,
            allowed: ['super_admin', 'admin', 'operator', 'cs']
        },
        {
            name: 'Data Pemesanan',
            path: '/admin/pemesanan',
            icon: <path d="M18 17H6v-2l1-1V9c0-2.74 1.69-5.19 4.23-6.32l-.25-.66C10.68 1.25 10.04 1 9.49 1c-2.07 0-3.9 1.4-4.32 3.44l-.16.81C2.59 7.42 2 10.37 2 12.33V23h18.23l-2.07-2.07c-.12-.11-.16-.27-.16-.93zM8 23h8v-2H8v2zm12-9c-1.1 0-2 .9-2 2v1c0 2.21 1.79 4 4 4s4-1.79 4-4v-1c0-1.1-.9-2-2-2z" />,
            allowed: ['super_admin', 'admin', 'operator', 'cs']
        },
        {
            name: 'Manajemen Tugas',
            path: '/admin/manajemen-tugas',
            icon: <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />,
            allowed: ['super_admin']
        },
        {
            name: 'Tugas Saya',
            path: '/admin/tugas-saya',
            icon: <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />,
            allowed: ['admin', 'operator', 'cs']
        },
        {
            name: 'Pengguna',
            path: '/admin/pengguna',
            icon: <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />,
            allowed: ['super_admin', 'admin']
        },
        {
            name: 'Laporan',
            path: '/admin/laporan',
            icon: <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />,
            allowed: ['super_admin', 'admin', 'operator']
        }
    ];

    const filteredMenu = role ? menuItems.filter(item => item.allowed.includes(role)) : [];

    const handleLogout = () => {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_name');
            window.location.href = '/';
        }
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <div className={styles.sidebarLogo}>
                    <img
                        src="/logo1.png"
                        alt="Logo"
                        width="30"
                        height="30"
                        suppressHydrationWarning
                        style={{ objectFit: 'contain' }}
                    />
                    <span>ADMIN PANEL</span>
                </div>
            </div>

            <nav className={styles.nav}>
                {filteredMenu.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`${styles.navItem} ${pathname === item.path ? styles.navItemActive : ''}`}
                    >
                        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
                            {item.icon}
                        </svg>
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className={styles.sidebarFooter}>
                <div className={styles.navItem} onClick={handleLogout} style={{ color: '#f87171', justifyContent: 'flex-start' }}>
                    <svg className={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                    </svg>
                    <span>Keluar</span>
                </div>
            </div>
        </aside>
    );
}
