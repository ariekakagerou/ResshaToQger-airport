"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/admin/Admin.module.css';

export default function BandaraPage() {
    const router = useRouter();
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAirports = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            const res = await fetch(`${apiUrl}/airports`);
            const json = await res.json();
            setAirports(json.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAirports();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Hapus bandara ini?')) return;
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            await fetch(`${apiUrl}/airports/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchAirports();
        } catch (e) {
            alert('Gagal hapus');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Data Bandara</h1>
                <button
                    onClick={() => router.push('/admin/bandara/create')}
                    style={{
                        background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px',
                        borderRadius: '8px', cursor: 'pointer', fontWeight: 600
                    }}
                >
                    + Tambah Bandara
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Kode IATA</th>
                            <th>Nama Bandara</th>
                            <th>Kota</th>
                            <th>Negara</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {airports.map((airport) => (
                            <tr key={airport.id}>
                                <td><span style={{ fontWeight: 700, background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px' }}>{airport.code}</span></td>
                                <td>{airport.name}</td>
                                <td>{airport.city}</td>
                                <td>{airport.country}</td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <button
                                            onClick={() => router.push(`/admin/bandara/edit/${airport.id}`)}
                                            style={{ marginRight: '10px', background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(airport.id)}
                                            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
