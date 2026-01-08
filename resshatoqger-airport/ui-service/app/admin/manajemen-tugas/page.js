"use client";
import { useState, useEffect } from 'react';
import styles from '@/components/admin/Admin.module.css';

export default function TaskManagementPage() {
    const [tasks, setTasks] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assigned_to: '',
        priority: 'medium',
        due_date: ''
    });

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

        const [tasksRes, usersRes] = await Promise.all([
            fetch(`${apiUrl}/admin/tasks/all`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${apiUrl}/admin/tasks/assignees`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const tasksJson = await tasksRes.json();
        const usersJson = await usersRes.json();

        setTasks(tasksJson.data || []);
        setAssignees(usersJson.data || []);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

            const res = await fetch(`${apiUrl}/admin/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTask)
            });

            if (res.ok) {
                alert('Tugas berhasil dibuat!');
                setShowForm(false);
                setNewTask({ title: '', description: '', assigned_to: '', priority: 'medium', due_date: '' });
                fetchData();
            } else {
                alert('Gagal membuat tugas.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manajemen Tugas Admin</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
                >
                    + Buat Tugas Baru
                </button>
            </div>

            {showForm && (
                <div className={styles.formContainer} style={{ marginBottom: '30px' }}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Judul Tugas</label>
                            <input className={styles.input} required
                                value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Deskripsi</label>
                            <textarea className={styles.input} rows="3"
                                value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
                        </div>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Tugaskan Kepada</label>
                                <select className={styles.select} required
                                    value={newTask.assigned_to} onChange={e => setNewTask({ ...newTask, assigned_to: e.target.value })}>
                                    <option value="">Pilih Staff...</option>
                                    {assignees.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Prioritas</label>
                                <select className={styles.select}
                                    value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Tenggat Waktu</label>
                                <input type="date" className={styles.input}
                                    value={newTask.due_date} onChange={e => setNewTask({ ...newTask, due_date: e.target.value })} />
                            </div>
                        </div>
                        <button type="submit" className={styles.btnPrimary} style={{ marginTop: '20px' }}>Simpan Tugas</button>
                    </form>
                </div>
            )}

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tugas</th>
                            <th>Staff</th>
                            <th>Status</th>
                            <th>Prioritas</th>
                            <th>Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.id}>
                                <td>{task.title}</td>
                                <td>{task.assignee?.name}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${task.status === 'completed' ? styles.statusSuccess :
                                            task.status === 'in_progress' ? styles.statusInfo : styles.statusWarning
                                        }`}>
                                        {task.status}
                                    </span>
                                </td>
                                <td>{task.priority}</td>
                                <td>{task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
