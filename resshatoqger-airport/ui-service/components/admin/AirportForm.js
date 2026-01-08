"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/admin/Admin.module.css';

export default function AirportForm({ initialData = null, isEdit = false }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        city: '',
        country: 'Indonesia'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                code: initialData.code,
                name: initialData.name,
                city: initialData.city,
                country: initialData.country
            });
        }
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
                ? `${apiUrl}/airports/${initialData.id}`
                : `${apiUrl}/airports`;

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
                alert(`Bandara berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}!`);
                router.push('/admin/bandara');
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
                {isEdit ? 'Edit Bandara' : 'Tambah Bandara Baru'}
            </h2>

            <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Kode IATA (3 Huruf)</label>
                        <input
                            name="code"
                            className={styles.input}
                            placeholder="Ex: CGK"
                            maxLength="3"
                            value={formData.code}
                            onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Nama Bandara</label>
                        <input
                            name="name"
                            className={styles.input}
                            placeholder="Ex: Soekarno-Hatta International Airport"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Kota</label>
                        <input
                            name="city"
                            className={styles.input}
                            placeholder="Ex: Tangerang / Jakarta"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Negara</label>
                        <input
                            name="country"
                            className={styles.input}
                            placeholder="Ex: Indonesia"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button type="button" className={styles.btnSecondary} onClick={() => router.back()}>
                        Batal
                    </button>
                    <button type="submit" className={styles.btnPrimary} disabled={loading}>
                        {loading ? 'Menyimpan...' : (isEdit ? 'Update Bandara' : 'Simpan Bandara')}
                    </button>
                </div>
            </form>
        </div>
    );
}
