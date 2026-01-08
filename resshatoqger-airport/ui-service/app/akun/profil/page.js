"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

                // Fetch User
                const userRes = await fetch(`${apiUrl}/user`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const userData = await userRes.json();
                setUser(userData);

                // Fetch Bookings
                const bookingsRes = await fetch(`${apiUrl}/bookings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const bookingsData = await bookingsRes.json();
                setBookings(bookingsData.data || []);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [router]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '50px 20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '20px', fontWeight: '700' }}>Profil Saya</h1>

            {/* Profile Card */}
            <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#64748b' }}>
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{user?.name}</h2>
                        <p style={{ color: '#64748b' }}>{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Bookings History */}
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: '700' }}>Riwayat Pemesanan</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {bookings.length > 0 ? bookings.map(booking => (
                    <div key={booking.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                        <div>
                            <div style={{ fontWeight: '700', color: '#2563eb' }}>{booking.booking_code}</div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{new Date(booking.created_at).toLocaleDateString()}</div>
                        </div>
                        <div>
                            <div style={{ fontWeight: '600' }}>{booking.flight.airline.name}</div>
                            <div>{booking.flight.origin.code} → {booking.flight.destination.code}</div>
                        </div>
                        <div>
                            <div style={{ fontWeight: '600' }}>{new Date(booking.flight.departure_time).toLocaleString()}</div>
                            <div style={{ color: booking.status === 'confirmed' ? 'green' : 'red', textTransform: 'capitalize' }}>
                                {booking.status === 'confirmed' ? 'Terkonfirmasi' : booking.status}
                            </div>
                        </div>
                        <div style={{ fontWeight: '700', color: '#0f172a' }}>
                            IDR {parseFloat(booking.total_price).toLocaleString()}
                        </div>
                    </div>
                )) : (
                    <p style={{ color: '#64748b', textAlign: 'center', padding: '20px', background: 'white', borderRadius: '8px' }}>Belum ada riwayat pemesanan.</p>
                )}
            </div>
        </div>
    );
}
