"use client";
import FlightForm from "@/components/admin/FlightForm";

export default function CreateFlightPage() {
    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    ← Kembali
                </button>
            </div>
            <FlightForm />
        </div>
    );
}
