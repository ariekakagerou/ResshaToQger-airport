"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function BookingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const flightId = searchParams.get('flightId');

    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [passengerName, setPassengerName] = useState('');
    const [passengerEmail, setPassengerEmail] = useState('');
    const [passengerPhone, setPassengerPhone] = useState('');
    const [passengersCount, setPassengersCount] = useState(1); // Default 1
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        const fetchFlight = async () => {
            if (!flightId) return;
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
                const response = await fetch(`${apiUrl}/flights/${flightId}`);
                if (!response.ok) throw new Error('Data penerbangan tidak ditemukan');
                const json = await response.json();
                setFlight(json.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Silakan login terlebih dahulu untuk melakukan pemesanan.');
            router.push('/auth/login');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setPassengerName(user.name || '');
        setPassengerEmail(user.email || '');

        fetchFlight();
    }, [flightId, router]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

            const response = await fetch(`${apiUrl}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    flight_id: flightId,
                    passenger_name: passengerName,
                    passenger_email: passengerEmail,
                    passenger_phone: passengerPhone,
                    passengers_count: parseInt(passengersCount) // Send count
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Gagal membuat pesanan');
            }

            const bookingData = await response.json();
            alert('Pemesanan Berhasil! Silakan Lakukan Pembayaran.');
            router.push(`/struk/${bookingData.data.id}`);

        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) return <div className={styles.container}>Loading...</div>;
    if (error) return <div className={styles.container}>Error: {error}</div>;

    // Calculate Estimated Total
    const ticketPrice = flight ? parseFloat(flight.price) * passengersCount : 0;
    const adminFee = 25000;
    const totalEstimate = ticketPrice + adminFee;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Konfirmasi Pemesanan</h1>

                {flight && (
                    <div className={styles.flightSummary}>
                        <h3>{flight.airline.name} - {flight.flight_number}</h3>
                        <p>{flight.origin.city} ({flight.origin.code}) → {flight.destination.city} ({flight.destination.code})</p>
                        <p>Waktu: {new Date(flight.departure_time).toLocaleString()}</p>
                        <p className={styles.price}>Harga per Tiket: IDR {parseInt(flight.price).toLocaleString()}</p>
                    </div>
                )}

                <form onSubmit={handleBooking} className={styles.form}>
                    <div className={styles.formGroup} style={{ background: '#f0f9ff', padding: '15px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                        <label style={{ fontWeight: 'bold', color: '#0369a1' }}>Jumlah Penumpang</label>
                        <select
                            className={styles.input}
                            value={passengersCount}
                            onChange={(e) => setPassengersCount(e.target.value)}
                            style={{ fontWeight: 'bold', fontSize: '1.1rem' }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <option key={n} value={n}>{n} Orang</option>
                            ))}
                        </select>
                        <p style={{ marginTop: '5px', fontSize: '0.9rem', color: '#0284c7' }}>
                            Total Tiket: IDR {ticketPrice.toLocaleString('id-ID')}
                        </p>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Nama Pemesan (Perwakilan)</label>
                        <input
                            type="text"
                            value={passengerName}
                            onChange={(e) => setPassengerName(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email Kontak</label>
                        <input
                            type="email"
                            value={passengerEmail}
                            onChange={(e) => setPassengerEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Nomor Telepon</label>
                        <input
                            type="tel"
                            value={passengerPhone}
                            onChange={(e) => setPassengerPhone(e.target.value)}
                            required
                            className={styles.input}
                            placeholder="08123456789"
                        />
                    </div>

                    <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', textAlign: 'right' }}>
                        <p>Subtotal Tiket: IDR {ticketPrice.toLocaleString()}</p>
                        <p>Biaya Layanan: IDR {adminFee.toLocaleString()}</p>
                        <h3 style={{ color: '#3b82f6', marginTop: '10px' }}>Total Estimasi: IDR {totalEstimate.toLocaleString()}</h3>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={submitLoading} style={{ marginTop: '20px' }}>
                        {submitLoading ? 'Memproses...' : 'Lanjut Pembayaran'}
                    </button>
                    <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
                        Batal
                    </button>
                </form>
            </div>
        </div>
    );
}
