"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/admin/Admin.module.css';

export default function ManualBookingPage() {
    const router = useRouter();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        flight_id: '',
        passenger_name: '',
        passenger_email: '',
        passengers_count: 1,
        payment_status: 'paid',
        payment_method: 'CASH'
    });

    // Fetch Flights for Dropdown
    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
                const res = await fetch(`${apiUrl}/flights?per_page=50`); // Get active flights
                const json = await res.json();
                setFlights(json.data || []);
            } catch (err) {
                console.error("Failed to fetch flights");
            }
        };
        fetchFlights();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

            const res = await fetch(`${apiUrl}/admin/bookings/manual`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const json = await res.json();

            if (res.ok) {
                alert('Pemesanan Manual Berhasil!');
                // Redirect to Ticket/Receipt page. Using dummy logic for now but passing ID.
                router.push(`/tiket/${json.data.id}`);
            } else {
                alert(`Gagal: ${json.message || 'Error invalid input'}`);
            }
        } catch (error) {
            alert('Terjadi kesalahan sistem');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 style={{ marginBottom: '25px', fontSize: '1.5rem', fontWeight: 700 }}>Buat Pemesanan Manual</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Pilih Penerbangan</label>
                        <select
                            className={styles.select}
                            required
                            value={formData.flight_id}
                            onChange={(e) => setFormData({ ...formData, flight_id: e.target.value })}
                        >
                            <option value="">-- Pilih Penerbangan --</option>
                            {flights.map(flight => (
                                <option key={flight.id} value={flight.id}>
                                    {flight.flight_number} - {flight.airline.name} ({flight.origin.code} ➝ {flight.destination.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Jumlah Penumpang</label>
                        <input
                            type="number"
                            min="1"
                            className={styles.input}
                            value={formData.passengers_count}
                            onChange={(e) => setFormData({ ...formData, passengers_count: parseInt(e.target.value) })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Nama Penumpang Utama</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Nama Lengkap KTP"
                            required
                            value={formData.passenger_name}
                            onChange={(e) => setFormData({ ...formData, passenger_name: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email Kontak</label>
                        <input
                            type="email"
                            className={styles.input}
                            placeholder="email@example.com"
                            required
                            value={formData.passenger_email}
                            onChange={(e) => setFormData({ ...formData, passenger_email: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Status Pembayaran</label>
                        <select
                            className={styles.select}
                            value={formData.payment_status}
                            onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                        >
                            <option value="paid">LUNAS (Paid)</option>
                            <option value="unpaid">BELUM LUNAS (Pending)</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Metode Pembayaran</label>
                        <select
                            className={styles.select}
                            value={formData.payment_method}
                            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                        >
                            <option value="CASH">Tunai (Cash)</option>
                            <option value="TRANSFER">Transfer Bank</option>
                            <option value="EDC">Kartu Debit/Kredit (EDC)</option>
                        </select>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button type="button" className={styles.btnSecondary} onClick={() => router.back()}>Batal</button>
                    <button type="submit" className={styles.btnPrimary} disable={loading}>
                        {loading ? 'Memproses...' : 'Buat Tiket'}
                    </button>
                </div>
            </form>
        </div>
    );
}
