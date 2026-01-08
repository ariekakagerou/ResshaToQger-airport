"use client";
import styles from '@/components/admin/Admin.module.css';

export default function LaporanPage() {
    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px' }}>Laporan & Statistik</h1>

            <div className={styles.cardGrid}>
                <div className={styles.statsCard} style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ marginBottom: '15px', color: '#94a3b8' }}>Grafik Pendapatan (Simulasi)</h3>
                    <div style={{ height: '200px', background: '#334155', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        [Area Grafik Placeholder]
                    </div>
                </div>
                <div className={styles.statsCard}>
                    <h3 style={{ marginBottom: '15px', color: '#94a3b8' }}>Top Destinasi</h3>
                    <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                        <li>Bali (DPS) - 45%</li>
                        <li>Jakarta (CGK) - 25%</li>
                        <li>Singapore (SIN) - 15%</li>
                        <li>Tokyo (HND) - 10%</li>
                        <li>Lainnya - 5%</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
