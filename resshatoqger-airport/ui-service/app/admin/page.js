"use client";
import { useEffect, useState } from 'react';
import styles from '@/components/admin/Admin.module.css';

export default function AdminDashboardData() {
    const [stats, setStats] = useState({
        total_income: 0,
        active_flights: 0,
        total_bookings: 0,
        pending_tasks: 0,
        recent_bookings: [],
        sales_chart: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
                const res = await fetch(`${apiUrl}/admin/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();
                setStats(json);
            } catch (error) {
                console.error("Failed to load stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading Dashboard...</div>;

    // Determine max value for chart scaling
    const maxVal = Math.max(...stats.sales_chart.map(d => d.total), 1);

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px' }}>Dashboard Admin</h1>

            <div className={styles.gridContainer}>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Total Pendapatan</div>
                    <div className={styles.cardValue} style={{ color: '#10b981' }}>
                        IDR {parseInt(stats.total_income).toLocaleString('id-ID')}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>confirmed & paid bookings</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Penerbangan Aktif</div>
                    <div className={styles.cardValue}>{stats.active_flights}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Scheduled Departures</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Total Pemesanan</div>
                    <div className={styles.cardValue}>{stats.total_bookings}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>All time</div>
                </div>
                <div className={styles.card}>
                    <div className={styles.cardTitle}>Tugas Pending</div>
                    <div className={styles.cardValue} style={{ color: '#f59e0b' }}>{stats.pending_tasks}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Need attention</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '30px' }}>
                <div className={styles.tableContainer} style={{ padding: '20px' }}>
                    <h3 style={{ marginBottom: '20px', fontWeight: 'bold' }}>Grafik Pendapatan (7 Hari Terakhir)</h3>
                    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                        {stats.sales_chart.map((d, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                <div
                                    style={{
                                        width: '100%',
                                        height: `${(d.total / maxVal) * 150}px`,
                                        background: '#3b82f6',
                                        borderRadius: '4px',
                                        minHeight: '4px',
                                        transition: 'height 0.5s ease'
                                    }}
                                    title={`IDR ${d.total.toLocaleString()}`}
                                />
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.tableContainer} style={{ padding: '0' }}>
                    <div style={{ padding: '15px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>Pemesanan Terbaru</div>
                    <div style={{ padding: '10px' }}>
                        {stats.recent_bookings.map(b => (
                            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', fontSize: '0.9rem', borderBottom: '1px dashed #f1f5f9' }}>
                                <div>
                                    <div style={{ fontWeight: '600' }}>{b.passenger_name}</div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{b.flight.airline.name}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        color:
                                            b.status === 'confirmed' ? '#10b981' :
                                                b.status === 'pending' ? '#f59e0b' :
                                                    b.status === 'waiting_confirmation' ? '#6366f1' : '#ef4444',
                                        fontWeight: 'bold', fontSize: '0.8rem'
                                    }}>
                                        {b.status.toUpperCase()}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(b.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
