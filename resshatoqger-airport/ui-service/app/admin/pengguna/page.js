"use client";
import styles from '@/components/admin/Admin.module.css';

export default function PenggunaPage() {
    const users = [
        { id: 'USR-001', name: 'Budi Santoso', email: 'budi@example.com', role: 'User', status: 'Active', joined: '10 Jan 2024' },
        { id: 'USR-002', name: 'Administrator', email: 'admin@airport.com', role: 'Admin', status: 'Active', joined: '01 Jan 2024' },
        { id: 'USR-003', name: 'Siti Aminah', email: 'siti@example.com', role: 'User', status: 'Inactive', joined: '15 Feb 2024' },
        { id: 'USR-004', name: 'Rizky Pratama', email: 'rizky@example.com', role: 'User', status: 'Active', joined: '20 Feb 2024' },
        { id: 'USR-005', name: 'Staff Ticketing', email: 'staff@airport.com', role: 'Staff', status: 'Active', joined: '05 Jan 2024' },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Active': return styles.statusSuccess;
            case 'Inactive': return styles.statusWarning;
            case 'Banned': return styles.statusDanger;
            default: return styles.statusInfo;
        }
    };

    const getRoleBadge = (role) => {
        const style = {
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '600',
            backgroundColor: role === 'Admin' ? '#6366f1' : role === 'Staff' ? '#a855f7' : '#64748b',
            color: 'white'
        };
        return <span style={style}>{role}</span>;
    };

    return (
        <div>
            <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>Data Pengguna</div>
                <button className={styles.statusInfo} style={{ border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: '6px' }}>
                    + Tambah Pengguna
                </button>
            </div>

            <div className={styles.tableContainer} style={{ marginTop: '20px' }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID User</th>
                            <th>Nama Lengkap</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Bergabung</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td style={{ fontWeight: '500' }}>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{getRoleBadge(user.role)}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${getStatusClass(user.status)}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>{user.joined}</td>
                                <td>
                                    <button style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', marginRight: '10px' }}>Edit</button>
                                    <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
