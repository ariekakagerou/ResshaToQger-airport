"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './CheckIn.module.css';

export default function CheckInPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [occupiedSeats, setOccupiedSeats] = useState([]);

    // Configuration for a narrow body jet (e.g. Boeing 737 / A320)
    const rows = 30;
    const cols = ['A', 'B', 'C', 'D', 'E', 'F'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
                const res = await fetch(`${apiUrl}/bookings/${id}/seat-map`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to load seat map');
                const json = await res.json();

                setBookingData(json.flight);
                setOccupiedSeats(json.occupied_seats || []);
                if (json.current_seat) setSelectedSeat(json.current_seat);
            } catch (error) {
                console.error(error);
                alert('Gagal memuat data check-in');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    const handleSeatClick = (seat) => {
        if (occupiedSeats.includes(seat)) return; // Occupied
        setSelectedSeat(seat);
    };

    const submitCheckIn = async () => {
        if (!selectedSeat) return alert('Silakan pilih kursi terlebih dahulu!');

        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

            const res = await fetch(`${apiUrl}/bookings/${id}/check-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ seat_number: selectedSeat })
            });

            if (res.ok) {
                alert('Check-In Berhasil! Kursi Anda: ' + selectedSeat);
                router.push(`/tiket/${id}`);
            } else {
                const json = await res.json();
                alert('Gagal Check-In: ' + json.message);
            }
        } catch (error) {
            alert('Terjadi kesalahan jaringan');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Memuat Denah Kursi...</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>Online Check-In</h1>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '30px' }}>
                Penerbangan {bookingData?.airline.name} ({bookingData?.flight_number})
            </p>

            <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                {/* Cockpit Indicator */}
                <div style={{
                    width: '100%', height: '60px', borderRadius: '50px 50px 0 0',
                    background: '#e2e8f0', marginBottom: '20px', position: 'relative'
                }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 'bold', color: '#94a3b8' }}>COCKPIT</div>
                </div>

                <div className={styles.fuselage}>
                    {Array.from({ length: rows }).map((_, r) => {
                        const rowNum = r + 1;
                        return (
                            <div key={rowNum} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                                {/* Left Side */}
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {['A', 'B', 'C'].map(col => {
                                        const seatId = `${rowNum}${col}`;
                                        const isOccupied = occupiedSeats.includes(seatId);
                                        const isSelected = selectedSeat === seatId;

                                        return (
                                            <button
                                                key={seatId}
                                                onClick={() => handleSeatClick(seatId)}
                                                disabled={isOccupied}
                                                style={{
                                                    width: '35px', height: '35px', borderRadius: '5px', border: 'none',
                                                    background: isSelected ? '#3b82f6' : isOccupied ? '#cbd5e1' : '#eff6ff',
                                                    color: isSelected ? 'white' : isOccupied ? '#94a3b8' : '#3b82f6',
                                                    cursor: isOccupied ? 'not-allowed' : 'pointer',
                                                    fontSize: '0.8rem', fontWeight: 'bold'
                                                }}
                                            >
                                                {col}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Aisle Indicator */}
                                <div style={{ width: '20px', textAlign: 'center', lineHeight: '35px', fontSize: '0.8rem', color: '#94a3b8' }}>
                                    {rowNum}
                                </div>

                                {/* Right Side */}
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {['D', 'E', 'F'].map(col => {
                                        const seatId = `${rowNum}${col}`;
                                        const isOccupied = occupiedSeats.includes(seatId);
                                        const isSelected = selectedSeat === seatId;

                                        return (
                                            <button
                                                key={seatId}
                                                onClick={() => handleSeatClick(seatId)}
                                                disabled={isOccupied}
                                                style={{
                                                    width: '35px', height: '35px', borderRadius: '5px', border: 'none',
                                                    background: isSelected ? '#3b82f6' : isOccupied ? '#cbd5e1' : '#eff6ff',
                                                    color: isSelected ? 'white' : isOccupied ? '#94a3b8' : '#3b82f6',
                                                    cursor: isOccupied ? 'not-allowed' : 'pointer',
                                                    fontSize: '0.8rem', fontWeight: 'bold'
                                                }}
                                            >
                                                {col}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ marginBottom: '10px' }}>Kursi Dipilih: <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#3b82f6' }}>{selectedSeat || '-'}</span></p>
                <button
                    onClick={submitCheckIn}
                    disabled={!selectedSeat}
                    style={{
                        background: selectedSeat ? '#10b981' : '#94a3b8', color: 'white', border: 'none',
                        padding: '15px 40px', borderRadius: '30px', cursor: selectedSeat ? 'pointer' : 'not-allowed',
                        fontSize: '1rem', fontWeight: 'bold', width: '100%'
                    }}
                >
                    Konfirmasi Check-In
                </button>
            </div>
        </div>
    );
}
