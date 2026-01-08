"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Admin.module.css';

export default function FlightForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const [airlines, setAirlines] = useState([]);
    const [airports, setAirports] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        flight_number: '',
        airline_id: '',
        origin_id: '',
        destination_id: '',
        departure_time: '',
        arrival_time: '',
        price: '',
        capacity: 100,
        status: 'scheduled'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

                // Fetch Airlines & Airports
                const [airlinesRes, airportsRes] = await Promise.all([
                    fetch(`${apiUrl}/airlines`),
                    fetch(`${apiUrl}/airports`)
                ]);

                const airlinesJson = await airlinesRes.json();
                const airportsJson = await airportsRes.json();

                setAirlines(airlinesJson.data || []);
                setAirports(airportsJson.data || []);

                // If Edit Mode, populate form
                if (initialData) {
                    // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
                    const formatDateTime = (dateStr) => {
                        if (!dateStr) return '';
                        const d = new Date(dateStr);
                        // Adjust to local ISO string
                        const offset = d.getTimezoneOffset() * 60000;
                        const localISOTime = (new Date(d.getTime() - offset)).toISOString().slice(0, 16);
                        return localISOTime;
                    };

                    setFormData({
                        flight_number: initialData.flight_number,
                        airline_id: initialData.airline_id || initialData.airline?.id || '',
                        origin_id: initialData.origin_id || initialData.origin?.id || '',
                        destination_id: initialData.destination_id || initialData.destination?.id || '',
                        departure_time: formatDateTime(initialData.departure_time),
                        arrival_time: formatDateTime(initialData.arrival_time),
                        price: initialData.price,
                        capacity: initialData.capacity,
                        status: initialData.status
                    });
                }
            } catch (error) {
                console.error("Error loading form data:", error);
            }
        };

        fetchData();
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

            const url = isEdit
                ? `${apiUrl}/flights/${initialData.id}`
                : `${apiUrl}/flights`;

            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(`Penerbangan berhasil ${isEdit ? 'diperbarui' : 'dibuat'}!`);
                router.push('/admin/penerbangan');
                router.refresh();
            } else {
                const err = await response.json();
                alert(`Gagal: ${err.message || 'Terjadi kesalahan'}`);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Terjadi kesalahan sistem.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 style={{ marginBottom: '25px', fontSize: '1.5rem', fontWeight: 700 }}>
                {isEdit ? 'Edit Penerbangan' : 'Tambah Penerbangan Baru'}
            </h2>

            <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Nomor Penerbangan</label>
                        <input
                            name="flight_number"
                            className={styles.input}
                            placeholder="Contoh: GA-404"
                            value={formData.flight_number}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Maskapai</label>
                        <select
                            name="airline_id"
                            className={styles.select}
                            value={formData.airline_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Pilih Maskapai</option>
                            {airlines.map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Bandara Asal</label>
                        <select
                            name="origin_id"
                            className={styles.select}
                            value={formData.origin_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Pilih Asal</option>
                            {airports.map(a => (
                                <option key={a.id} value={a.id}>{a.city} ({a.code})</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Bandara Tujuan</label>
                        <select
                            name="destination_id"
                            className={styles.select}
                            value={formData.destination_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Pilih Tujuan</option>
                            {airports.map(a => (
                                <option key={a.id} value={a.id}>{a.city} ({a.code})</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Waktu Keberangkatan</label>
                        <input
                            type="datetime-local"
                            name="departure_time"
                            className={styles.input}
                            value={formData.departure_time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Waktu Kedatangan</label>
                        <input
                            type="datetime-local"
                            name="arrival_time"
                            className={styles.input}
                            value={formData.arrival_time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Harga Tiket (IDR)</label>
                        <input
                            type="number"
                            name="price"
                            className={styles.input}
                            placeholder="0"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Kapasitas Kursi</label>
                        <input
                            type="number"
                            name="capacity"
                            className={styles.input}
                            value={formData.capacity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Status Penerbangan</label>
                        <select
                            name="status"
                            className={styles.select}
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="scheduled">Scheduled (Terjadwal)</option>
                            <option value="delayed">Delayed (Tertunda)</option>
                            <option value="cancelled">Cancelled (Dibatalkan)</option>
                            <option value="completed">Completed (Selesai)</option>
                        </select>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button type="button" className={styles.btnSecondary} onClick={() => router.back()}>
                        Batal
                    </button>
                    <button type="submit" className={styles.btnPrimary} disabled={loading}>
                        {loading ? 'Menyimpan...' : (isEdit ? 'Update Penerbangan' : 'Simpan Penerbangan')}
                    </button>
                </div>
            </form>
        </div>
    );
}
