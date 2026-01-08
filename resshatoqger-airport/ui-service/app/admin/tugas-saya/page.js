"use client";
import { useState, useEffect } from 'react';
import styles from '@/components/admin/Admin.module.css';

export default function MyTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            const res = await fetch(`${apiUrl}/tasks/my-tasks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            setTasks(json.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

            await fetch(`${apiUrl}/tasks/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            fetchTasks();
        } catch (error) {
            alert('Gagal update status');
        }
    };

    if (loading) return <div>Loading Tugas...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>Tugas Saya</h1>
            <div className={styles.cardGrid}>
                {tasks.map(task => (
                    <div key={task.id} className={styles.statsCard} style={{ background: 'var(--bg-card)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{
                                padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                                background: task.priority === 'high' ? '#fecaca' : '#bfdbfe',
                                color: task.priority === 'high' ? '#b91c1c' : '#1d4ed8'
                            }}>
                                {task.priority.toUpperCase()}
                            </span>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                                Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                            </span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>{task.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '15px' }}>{task.description}</p>

                        <div style={{ marginTop: 'auto' }}>
                            <select
                                value={task.status}
                                onChange={(e) => updateStatus(task.id, e.target.value)}
                                className={styles.select}
                                style={{ width: '100%', padding: '8px', fontSize: '0.9rem' }}
                            >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                ))}
                {tasks.length === 0 && <p>Tidak ada tugas yang diberikan.</p>}
            </div>
        </div>
    );
}
