"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FlightForm from "@/components/admin/FlightForm";

export default function EditFlightPage() {
    const params = useParams();
    const id = params.id;
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
                const res = await fetch(`${apiUrl}/flights/${id}`);
                const json = await res.json();
                if (json.data) {
                    setFlight(json.data);
                } else {
                    alert('Data penerbangan tidak ditemukan');
                }
            } catch (err) {
                console.error(err);
                alert('Gagal mengambil data penerbangan');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFlight();
        }
    }, [id]);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Data...</div>;

    if (!flight) return <div>Data not found</div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    ← Kembali
                </button>
            </div>
            <FlightForm initialData={flight} isEdit={true} />
        </div>
    );
}
