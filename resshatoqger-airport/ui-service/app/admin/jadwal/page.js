"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/admin/Admin.module.css';

export default function JadwalPage() {
    const router = useRouter();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFlights = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            const res = await fetch(`${apiUrl}/flights`);
            const json = await res.json();
            setFlights(json.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlights();
    }, []);

    return (
        <div>
            <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>Jadwal Penerbangan (Real-time)</div>
                <button
                    onClick={() => router.push('/admin/penerbangan/create')}
                    className={styles.statusInfo}
                    style={{ border: 'none', cursor: 'pointer', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', color: 'white', background: '#3b82f6' }}
                >
                    + Tambah Penerbangan Baru
                </button>
            </div>

            <div className={styles.tableContainer} style={{ marginTop: '20px' }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>No. Penerbangan</th>
                            <th>Maskapai</th>
                            <th>Rute</th>
                            <th>Berangkat</th>
                            <th>Tiba</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map((flight) => {
                            const depTime = new Date(flight.departure_time);
                            const arrTime = new Date(flight.arrival_time);
                            const isPast = depTime < new Date();

                            return (
                                <tr key={flight.id}>
                                    <td style={{ fontWeight: '600' }}>{flight.flight_number}</td>
                                    <td>{flight.airline.name}</td>
                                    <td>{flight.origin.code} → {flight.destination.code}</td>
                                    <td>{depTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>{arrTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${isPast ? styles.statusDanger : styles.statusSuccess}`}>
                                            {isPast ? 'Selesai' : 'Aktif'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
