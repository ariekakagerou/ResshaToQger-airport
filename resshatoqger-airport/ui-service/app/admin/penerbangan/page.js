"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/admin/Admin.module.css';

export default function PenerbanganPage() {
    const router = useRouter();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('super_admin');

    const fetchFlights = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            const response = await fetch(`${apiUrl}/flights?per_page=100`); // Fetch more for admin view
            const json = await response.json();
            setFlights(json.data || []);
        } catch (error) {
            console.error('Failed to fetch flights', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Get role from storage
        const storedRole = localStorage.getItem('user_role') || 'super_admin';
        setRole(storedRole);
        fetchFlights();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Apakah Anda yakin ingin menghapus penerbangan ini?')) return;

        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

            const response = await fetch(`${apiUrl}/flights/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Penerbangan berhasil dihapus');
                fetchFlights(); // Refresh list
            } else {
                alert('Gagal menghapus penerbangan');
            }
        } catch (error) {
            console.error('Error deleting flight:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    // Define Read Only Roles
    const isReadOnly = role === 'cs';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Data Penerbangan</h1>
                {!isReadOnly && (
                    <button style={{
                        background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px',
                        borderRadius: '8px', cursor: 'pointer', fontWeight: 600
                    }} onClick={() => router.push('/admin/penerbangan/create')}>+ Tambah Penerbangan</button>
                )}
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Kode</th>
                            <th>Maskapai</th>
                            <th>Rute</th>
                            <th>Waktu (WIB)</th>
                            <th>Harga (IDR)</th>
                            {!isReadOnly && <th>Aksi</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map((flight) => (
                            <tr key={flight.id}>
                                <td><span style={{ fontWeight: 700 }}>{flight.flight_number}</span></td>
                                <td>{flight.airline.name}</td>
                                <td>{flight.origin.code} - {flight.destination.code}</td>
                                <td>
                                    {new Date(flight.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                    {new Date(flight.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td>{parseFloat(flight.price).toLocaleString('id-ID')}</td>
                                {!isReadOnly && (
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <button
                                                style={{ marginRight: '10px', background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontWeight: 600 }}
                                                onClick={() => router.push(`/admin/penerbangan/edit/${flight.id}`)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 600 }}
                                                onClick={() => handleDelete(flight.id)}
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                        {flights.length === 0 && (
                            <tr><td colSpan={isReadOnly ? 5 : 6} style={{ textAlign: 'center' }}>Tidak ada data penerbangan.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
