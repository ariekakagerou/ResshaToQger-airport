"use client";
import AirportForm from "@/components/admin/AirportForm";

export default function CreateAirportPage() {
    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    ← Kembali
                </button>
            </div>
            <AirportForm />
        </div>
    );
}
