"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './Struk.module.css';

export default function ReceiptPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    // Upload State
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const fetchBooking = async () => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            const response = await fetch(`${apiUrl}/bookings/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Data booking tidak ditemukan');
            const json = await response.json();
            setBooking(json.data);
        } catch (err) {
            console.error(err);
            alert('Gagal memuat struk');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchBooking();
    }, [id]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Pilih file gambar dulu");
        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

            const formData = new FormData();
            formData.append('payment_proof', file);

            const res = await fetch(`${apiUrl}/bookings/${id}/upload-proof`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert("Bukti berhasil diupload!");
                setFile(null);
                fetchBooking(); // Refresh status
            } else {
                alert("Gagal upload");
            }
        } catch (e) {
            console.error(e);
            alert("Error upload");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Memuat Struk...</div>;
    if (!booking) return <div style={{ textAlign: 'center', padding: '50px' }}>Struk Tidak Ditemukan.</div>;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '40px 20px', fontFamily: 'monospace' }}>
            <div style={{
                maxWidth: '400px', margin: '0 auto', background: 'white', padding: '30px',
                borderRadius: '5px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderTop: '5px solid #3b82f6'
            }}>
                {/* Header ... */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>BANDARA INTERNASIONAL</h2>
                    <h3 style={{ fontSize: '1rem', marginBottom: '5px' }}>RESSHATOQGER AIRPORT</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Jl. Raya Bandara No. 1</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 'bold', marginTop: '10px' }}>INVOICE / TAGIHAN</p>
                </div>

                {/* Status Indicator */}
                <div style={{
                    textAlign: 'center', padding: '10px', marginBottom: '20px', borderRadius: '5px', fontWeight: 'bold',
                    background: booking.status === 'confirmed' || booking.status === 'paid' ? '#dcfce7' :
                        booking.status === 'waiting_confirmation' ? '#e0e7ff' : '#fef9c3',
                    color: booking.status === 'confirmed' || booking.status === 'paid' ? '#166534' :
                        booking.status === 'waiting_confirmation' ? '#4338ca' : '#854d0e'
                }}>
                    STATUS: {booking.status.toUpperCase().replace('_', ' ')}
                </div>

                <div style={{ borderBottom: '2px dashed #e2e8f0', paddingBottom: '20px', marginBottom: '20px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>No. Pesanan</span>
                        <span style={{ fontWeight: 'bold' }}>{booking.booking_code}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>Tanggal</span>
                        <span>{new Date(booking.created_at).toLocaleString()}</span>
                    </div>
                </div>

                <div style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <p style={{ fontWeight: 'bold' }}>{booking.flight.flight_number} - {booking.flight.airline.name}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                            <span>Total Harga Tiket</span>
                            <span>{parseFloat(booking.total_price - booking.admin_fee).toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span>Biaya Admin</span>
                        <span>{parseFloat(booking.admin_fee).toLocaleString('id-ID')}</span>
                    </div>
                    <div style={{ borderTop: '1px solid #e2e8f0', margin: '10px 0' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px' }}>
                        <span>TOTAL TAGIHAN</span>
                        <span>IDR {parseFloat(booking.total_price).toLocaleString('id-ID')}</span>
                    </div>
                </div>

                {/* Upload Section (Only if Pending) */}
                {(booking.status === 'pending' || booking.status === 'unpaid') && (
                    <div className="no-print" style={{ background: '#fef2f2', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#ef4444' }}>⚠️ Pembayaran Belum Dikonfirmasi</p>
                        <p style={{ fontSize: '0.85rem', marginBottom: '10px' }}>Silakan transfer sesuai total tagihan, lalu upload bukti transfer di sini.</p>
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: '10px', width: '100%' }} />
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            style={{
                                width: '100%', background: '#ef4444', color: 'white', border: 'none',
                                padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            {uploading ? 'Mengupload...' : 'Upload Bukti Bayar'}
                        </button>
                    </div>
                )}

                {booking.status === 'waiting_confirmation' && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6366f1', background: '#e0e7ff', borderRadius: '8px', marginBottom: '20px' }}>
                        ⏳ Bukti transfer sedang diverifikasi oleh Admin. Harap tunggu 1x24 jam.
                    </div>
                )}

                <div className="no-print" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button onClick={handlePrint} style={{ background: '#334155', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        🖨️ Cetak Invoice
                    </button>
                    {(booking.status === 'confirmed' || booking.status === 'paid') && (
                        <button onClick={() => router.push(`/tiket/${booking.id}`)} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            🎫 Lihat Tiket
                        </button>
                    )}
                    <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #cbd5e1', color: '#64748b', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>
                        Kembali ke Home
                    </button>
                </div>
            </div>
            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; }
                }
            `}</style>
        </div>
    );
}
