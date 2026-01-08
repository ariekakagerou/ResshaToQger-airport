"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ActiveBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
                const res = await fetch(`${apiUrl}/bookings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();

                // Filter locally for 'Active' (Confirmed/Pending)
                const active = (json.data || []).filter(b =>
                    ['confirmed', 'pending', 'paid'].includes(b.status.toLowerCase())
                );
                setBookings(active);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [router]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Memuat Pesanan Aktif...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '30px', color: '#1e293b' }}>Pesanan Aktif</h1>

            <div style={{ display: 'grid', gap: '20px' }}>
                {bookings.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '10px', color: '#64748b' }}>
                        <p>Tidak ada pesanan aktif saat ini.</p>
                        <button
                            onClick={() => router.push('/')}
                            style={{ marginTop: '15px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Cari Penerbangan
                        </button>
                    </div>
                ) : (
                    bookings.map(booking => (
                        <div key={booking.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '15px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{booking.flight.airline.name}</span>
                                    <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{booking.booking_code}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '30px', margin: '15px 0' }}>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>Berangkat</p>
                                        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: '5px 0' }}>{new Date(booking.flight.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p style={{ fontSize: '0.9rem' }}>{booking.flight.origin.city} ({booking.flight.origin.code})</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', color: '#cbd5e1' }}>✈️</div>
                                    <div>
                                        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>Tiba</p>
                                        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: '5px 0' }}>{new Date(booking.flight.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p style={{ fontSize: '0.9rem' }}>{booking.flight.destination.city} ({booking.flight.destination.code})</p>
                                    </div>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
                                    Penumpang: <span style={{ color: '#0f172a', fontWeight: '500' }}>{booking.passenger_name}</span>
                                </p>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '15px' }}>
                                    IDR {parseInt(booking.total_price).toLocaleString('id-ID')}
                                </p>
                                {booking.status === 'pending' || booking.status === 'unpaid' ? (
                                    <button
                                        onClick={() => router.push(`/struk/${booking.id}`)}
                                        style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Bayar Sekarang
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => router.push(`/tiket/${booking.id}`)}
                                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Lihat Tiket
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
