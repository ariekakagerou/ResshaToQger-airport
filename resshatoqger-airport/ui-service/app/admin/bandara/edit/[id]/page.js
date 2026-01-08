"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AirportForm from "@/components/admin/AirportForm";

export default function EditAirportPage() {
    const params = useParams();
    const id = params.id;
    const [airport, setAirport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAirport = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
                const res = await fetch(`${apiUrl}/airports/${id}`);
                const json = await res.json();
                if (json.data) {
                    setAirport(json.data);
                } else {
                    alert('Data bandara tidak ditemukan');
                }
            } catch (err) {
                console.error(err);
                alert('Gagal mengambil data bandara');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAirport();
        }
    }, [id]);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Data...</div>;
    if (!airport) return <div>Data not found</div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    ← Kembali
                </button>
            </div>
            <AirportForm initialData={airport} isEdit={true} />
        </div>
    );
}
