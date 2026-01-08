"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/components/admin/Admin.module.css';

export default function ScheduleForm() {
    // Placeholder for Schedule Management (Slot Time)
    return (
        <div className={styles.formContainer}>
            <h2 style={{ marginBottom: '25px', fontSize: '1.5rem', fontWeight: 700 }}>
                Kelola Slot Jadwal
            </h2>
            <div style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', color: '#60a5fa' }}>
                ℹ️ Jadwal penerbangan saat ini terikat langsung dengan Data Penerbangan utama. Silakan gunakan menu "Data Penerbangan" untuk menambah jadwal baru.
            </div>
            <br />
            <button className={styles.btnSecondary} onClick={() => window.history.back()}>Kembali</button>
        </div>
    );
}
