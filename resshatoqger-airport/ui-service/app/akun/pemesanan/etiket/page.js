"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ETicketPage() {
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

                // Show confirmed bookings (Tickets)
                const tickets = (json.data || []).filter(b =>
                    ['confirmed', 'paid', 'completed'].includes(b.status.toLowerCase())
                );
                setBookings(tickets);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [router]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Memuat E-Tiket...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '30px', color: '#1e293b' }}>E-Tiket Saya</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {bookings.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '10px', color: '#64748b' }}>
                        <p>Belum ada tiket yang tersedia.</p>
                    </div>
                ) : (
                    bookings.map(booking => (
                        <div key={booking.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', transition: 'transform 0.2s' }}>
                            <div style={{ background: '#3b82f6', padding: '15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold' }}>{booking.booking_code}</span>
                                <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>{new Date(booking.flight.departure_time).toLocaleDateString()}</span>
                            </div>
                            <div style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>{booking.flight.origin.code}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{booking.flight.origin.city}</div>
                                    </div>
                                    <div style={{ alignSelf: 'center', color: '#cbd5e1' }}>✈️</div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>{booking.flight.destination.code}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{booking.flight.destination.city}</div>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '15px', marginBottom: '15px' }}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#64748b' }}>Penumpang</p>
                                    <p style={{ margin: 0, fontWeight: '500' }}>{booking.passenger_name}</p>
                                </div>
                                <button
                                    onClick={() => router.push(`/tiket/${booking.id}`)}
                                    style={{ width: '100%', padding: '12px', background: 'white', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Buka Tiket
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
