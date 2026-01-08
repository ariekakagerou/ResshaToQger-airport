"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/admin/Admin.module.css';

export default function PemesananPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null); // Modal state

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            const res = await fetch(`${apiUrl}/admin/bookings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const json = await res.json();
            setBookings(json.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleVerify = async (id, action) => {
        if (!confirm(`Yakin ingin ${action === 'approve' ? 'menyetujui' : 'menolak'} pembayaran ini?`)) return;
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            const res = await fetch(`${apiUrl}/admin/bookings/${id}/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action })
            });

            if (res.ok) {
                alert('Berhasil!');
                setSelectedBooking(null);
                fetchBookings();
            }
        } catch (e) {
            alert('Gagal verifikasi');
        }
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
            case 'paid':
                return styles.statusSuccess;
            case 'pending':
            case 'unpaid':
                return styles.statusWarning;
            case 'waiting_confirmation':
                return styles.statusInfo;
            case 'cancelled':
                return styles.statusDanger;
            default: return styles.statusInfo;
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Memuat Data...</div>;

    return (
        <div>
            <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>Data Pemesanan</div>
                <button
                    onClick={() => router.push('/admin/pemesanan/create')}
                    className={styles.statusInfo}
                    style={{ border: 'none', cursor: 'pointer', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', color: 'white', background: '#3b82f6' }}
                >
                    + Tambah Pemesanan Manual
                </button>
            </div>

            <div className={styles.tableContainer} style={{ marginTop: '20px' }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Kode</th>
                            <th>Penumpang</th>
                            <th>Penerbangan</th>
                            <th>Rute</th>
                            <th>Status</th>
                            <th>Total</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td style={{ fontWeight: 'bold' }}>{booking.booking_code}</td>
                                <td>
                                    <div>{booking.passenger_name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{booking.passenger_email}</div>
                                </td>
                                <td>{booking.flight.flight_number}</td>
                                <td>{booking.flight.origin.code} → {booking.flight.destination.code}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${getStatusClass(booking.status)}`}>
                                        {booking.status.toUpperCase().replace('_', ' ')}
                                    </span>
                                </td>
                                <td>IDR {parseInt(booking.total_price).toLocaleString()}</td>
                                <td>
                                    <button
                                        onClick={() => setSelectedBooking(booking)}
                                        style={{ background: '#f1f5f9', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#334155' }}
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Detail & Verifikasi */}
            {selectedBooking && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '30px', borderRadius: '15px', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginBottom: '20px' }}>Detail Pemesanan {selectedBooking.booking_code}</h2>

                        <div style={{ display: 'grid', gap: '10px', fontSize: '0.9rem' }}>
                            <p><strong>Nama:</strong> {selectedBooking.passenger_name}</p>
                            <p><strong>Email:</strong> {selectedBooking.passenger_email}</p>
                            <p><strong>Penerbangan:</strong> {selectedBooking.flight.airline.name} ({selectedBooking.flight.flight_number})</p>
                            <p><strong>Status:</strong> {selectedBooking.status.toUpperCase()}</p>
                            <p><strong>Total Tagihan:</strong> IDR {parseInt(selectedBooking.total_price).toLocaleString()}</p>
                        </div>

                        {selectedBooking.payment_proof && (
                            <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                                <p style={{ fontWeight: 'bold' }}>Bukti Pembayaran:</p>
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/../storage/${selectedBooking.payment_proof}`}
                                    alt="Bukti Transfer"
                                    style={{ width: '100%', marginTop: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />

                                {selectedBooking.status === 'waiting_confirmation' && (
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                        <button
                                            onClick={() => handleVerify(selectedBooking.id, 'approve')}
                                            style={{ flex: 1, padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            Setujui
                                        </button>
                                        <button
                                            onClick={() => handleVerify(selectedBooking.id, 'reject')}
                                            style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                                        >
                                            Tolak
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => setSelectedBooking(null)}
                            style={{ width: '100%', marginTop: '20px', padding: '10px', background: '#64748b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
