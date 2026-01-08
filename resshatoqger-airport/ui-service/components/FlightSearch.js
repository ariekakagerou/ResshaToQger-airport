'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './FlightSearch.module.css';

export default function FlightSearch() {
    const router = useRouter();
    const [mode, setMode] = useState('classic'); // 'classic' or 'ai'
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [aiQuery, setAiQuery] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    // Mock API for city mapping
    const cityMap = {
        'jakarta': 'CGK', 'cgk': 'CGK',
        'bali': 'DPS', 'dps': 'DPS', 'denpasar': 'DPS',
        'surabaya': 'SUB', 'sub': 'SUB',
        'medan': 'KNO', 'kno': 'KNO',
        'singapore': 'SIN', 'sin': 'SIN', 'singapura': 'SIN',
        'tokyo': 'HND', 'haneda': 'HND', 'narita': 'NRT'
    };

    const handleAiSearch = async () => {
        setIsThinking(true);
        // Simulate AI processing delay
        await new Promise(r => setTimeout(r, 1200));

        const lowerQuery = aiQuery.toLowerCase();

        // Simple regex extraction logic (Mock AI)
        let foundOrigin = '';
        let foundDest = '';

        // Try to find "dari [city]"
        const fromMatch = lowerQuery.match(/dari\s+(\w+)/);
        if (fromMatch && cityMap[fromMatch[1]]) foundOrigin = cityMap[fromMatch[1]];

        // Try to find "ke [city]"
        const toMatch = lowerQuery.match(/ke\s+(\w+)/);
        if (toMatch && cityMap[toMatch[1]]) foundDest = cityMap[toMatch[1]];

        // Fallback: search for keywords if structure not found
        if (!foundOrigin || !foundDest) {
            Object.keys(cityMap).forEach(key => {
                if (lowerQuery.includes(key)) {
                    if (!foundOrigin) foundOrigin = cityMap[key];
                    else if (!foundDest && cityMap[key] !== foundOrigin) foundDest = cityMap[key];
                }
            });
        }

        // Date detection (Besok, Hari ini, or YYYY-MM-DD detection)
        let foundDate = '';
        if (lowerQuery.includes('besok')) {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            foundDate = d.toISOString().split('T')[0];
        } else if (lowerQuery.includes('hari ini')) {
            foundDate = new Date().toISOString().split('T')[0];
        } else if (lowerQuery.includes('minggu depan')) {
            const d = new Date();
            d.setDate(d.getDate() + 7);
            foundDate = d.toISOString().split('T')[0];
        } else {
            // Try to map specific date like "tanggal 15" (assumes current month/next month logic simplified)
            const dateMatch = lowerQuery.match(/tanggal\s+(\d+)/);
            if (dateMatch) {
                const d = new Date();
                const day = parseInt(dateMatch[1]);
                if (day >= d.getDate()) {
                    d.setDate(day);
                } else {
                    d.setMonth(d.getMonth() + 1);
                    d.setDate(day);
                }
                foundDate = d.toISOString().split('T')[0];
            }
        }

        // Apply detected values
        if (foundOrigin) setOrigin(foundOrigin);
        if (foundDest) setDestination(foundDest);
        if (foundDate) setDate(foundDate);

        setIsThinking(false);
        setMode('classic'); // Switch back to view results
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (origin) params.append('origin', origin);
        if (destination) params.append('destination', destination);
        if (date) params.append('date', date);
        router.push(`/penerbangan?${params.toString()}`);
    };

    return (
        <div className={styles.searchContainer}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>
                    {mode === 'ai' ? (
                        <>
                            <span className={styles.aiBadge}>AI Beta</span>
                            Asisten Pencarian
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            Cari Penerbangan
                        </>
                    )}
                </h2>
                <div className={styles.toggleContainer}>
                    <button
                        className={`${styles.toggleBtn} ${mode === 'classic' ? styles.active : ''}`}
                        onClick={() => setMode('classic')}
                    >
                        Standard
                    </button>
                    <button
                        className={`${styles.toggleBtn} ${mode === 'ai' ? styles.active : ''}`}
                        onClick={() => setMode('ai')}
                    >
                        AI Smart Search
                    </button>
                </div>
            </div>

            {mode === 'ai' ? (
                <div className={styles.aiWrapper}>
                    <textarea
                        className={styles.aiInput}
                        placeholder="Contoh: Saya ingin terbang dari Jakarta ke Bali besok pagi..."
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                    />
                    <div className={styles.aiFooter}>
                        <div className={styles.aiTips}>
                            💡 <strong>Tips:</strong> Coba ketik "Cari tiket ke Surabaya tanggal 20"
                        </div>
                        <button
                            className={styles.submitBtn}
                            onClick={handleAiSearch}
                            disabled={isThinking || !aiQuery}
                        >
                            {isThinking ? 'Menganalisis...' : 'Analisis & Isi Form'}
                        </button>
                    </div>
                </div>
            ) : (
                <form className={styles.formGrid} onSubmit={handleSearch}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Dari</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Kode (CGK)"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Ke</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Kode (DPS)"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value.toUpperCase())}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Tanggal</label>
                        <input
                            type="date"
                            className={styles.input}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitBtn}>
                        Cari Sekarang
                    </button>
                </form>
            )}
        </div>
    );
}
