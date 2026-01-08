"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckInLandingPage() {
    const router = useRouter();
    const [bookingCode, setBookingCode] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            const res = await fetch(`${apiUrl}/bookings/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ booking_code: bookingCode, passenger_name: lastName })
            });

            if (res.ok) {
                const json = await res.json();
                // Redirect to Seat Map Page
                // Ensure user is logged in for the next step, or handle guest flow there.
                // For now, redirect. The next page will verify token.
                router.push(`/check-in/${json.data.id}`);
            } else {
                alert('Pemesanan tidak ditemukan. Periksa Kode Booking dan Nama Penumpang.');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '80vh', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', background: '#f8fafc', padding: '20px'
        }}>
            <div style={{
                background: 'white', padding: '40px', borderRadius: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)', maxWidth: '400px', width: '100%'
            }}>
                <h1 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '10px' }}>Web Check-In</h1>
                <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '30px', fontSize: '0.9rem' }}>
                    Silakan masukkan detail penerbangan Anda untuk memilih kursi.
                </p>

                <form onSubmit={handleSearch}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Kode Booking (6 Digit)</label>
                        <input
                            type="text"
                            placeholder="Contoh: BK-ABC123"
                            value={bookingCode}
                            onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                        />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>Nama Belakang Penumpang</label>
                        <input
                            type="text"
                            placeholder="Sesuai KTP"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '15px', background: '#ef4444', color: 'white',
                            border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Mencari...' : 'Cari Penerbangan'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
                    <p>Check-in dibuka 24 jam sebelum jadwal keberangkatan.</p>
                </div>
            </div>
        </div>
    );
}
