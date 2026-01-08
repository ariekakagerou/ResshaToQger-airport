'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function HelpPage() {
    const [openIndex, setOpenIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState('');
    const [showLiveChat, setShowLiveChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'bot', text: 'Halo! Ada yang bisa saya bantu?' }
    ]);
    const [chatInput, setChatInput] = useState('');

    const categories = [
        { id: 'all', name: 'Semua' },
        { id: 'checkin', name: 'Check-In' },
        { id: 'dokumen', name: 'Dokumen' },
        { id: 'refund', name: 'Refund' },
        { id: 'bagasi', name: 'Bagasi' },
        { id: 'pembayaran', name: 'Pembayaran' }
    ];

    const faqs = [
        { q: "Bagaimana cara melakukan check-in online?", a: "Anda dapat melakukan check-in online melalui menu 'Jadwal' atau tombol Check-In di halaman utama mulai 24 jam hingga 2 jam sebelum keberangkatan.", category: 'checkin' },
        { q: "Apa saja dokumen yang perlu dibawa?", a: "Penumpang wajib membawa E-Tiket (cetak/digital) dan Kartu Identitas yang berlaku (KTP/Paspor/SIM).", category: 'dokumen' },
        { q: "Apakah bisa mengajukan refund tiket?", a: "Pengajuan refund dapat dilakukan melalui menu 'Akun > Pemesanan Saya'. Kebijakan refund bergantung pada jenis tiket yang Anda beli.", category: 'refund' },
        { q: "Berapa bagasi maksimal yang diperbolehkan?", a: "Bagasi kabin maksimal 7kg. Bagasi terdaftar bervariasi tergantung maskapai, biasanya 20kg untuk domestik ekonomi.", category: 'bagasi' },
        { q: "Apa yang harus dilakukan jika check-in online gagal?", a: "Jika check-in online gagal, silakan coba refresh halaman atau gunakan browser berbeda. Jika masih gagal, Anda dapat check-in di bandara minimal 90 menit sebelum keberangkatan.", category: 'checkin' },
        { q: "Bagaimana cara mengubah nama penumpang di tiket?", a: "Perubahan nama penumpang dapat diajukan melalui Customer Service. Biaya perubahan berlaku sesuai kebijakan maskapai.", category: 'dokumen' },
        { q: "Berapa lama proses refund tiket?", a: "Proses refund membutuhkan waktu 7-14 hari kerja setelah pengajuan disetujui, tergantung metode pembayaran yang digunakan.", category: 'refund' },
        { q: "Apakah bisa menambah bagasi setelah check-in?", a: "Ya, Anda masih bisa menambah bagasi di konter check-in bandara. Namun harga akan lebih mahal dibanding pembelian online.", category: 'bagasi' },
        { q: "Metode pembayaran apa saja yang tersedia?", a: "Kami menerima pembayaran melalui Transfer Bank, Virtual Account, Kartu Kredit/Debit, E-Wallet (GoPay, OVO, Dana), dan pembayaran di Indomaret/Alfamart.", category: 'pembayaran' },
        { q: "Bagaimana cara mendapatkan invoice pembayaran?", a: "Invoice otomatis dikirim ke email setelah pembayaran berhasil. Anda juga dapat mengunduhnya di menu 'Akun > Pemesanan Saya'.", category: 'pembayaran' }
    ];

    const guides = [
        {
            title: "Panduan Check-In Online",
            icon: "✓",
            steps: [
                "Buka aplikasi atau website ResshaToQger",
                "Pilih menu 'Jadwal' atau klik tombol 'Check-In'",
                "Masukkan kode booking dan nama penumpang",
                "Pilih kursi yang tersedia",
                "Unduh boarding pass dalam format PDF/Digital"
            ]
        },
        {
            title: "Panduan Refund Tiket",
            icon: "💰",
            steps: [
                "Login ke akun Anda",
                "Pilih menu 'Akun' > 'Pemesanan Saya'",
                "Pilih tiket yang ingin di-refund",
                "Klik 'Ajukan Refund' dan isi formulir",
                "Tunggu konfirmasi via email dalam 1-3 hari kerja"
            ]
        },
        {
            title: "Tips Perjalanan Lancar",
            icon: "✈️",
            steps: [
                "Datang ke bandara minimal 90 menit sebelum keberangkatan",
                "Pastikan dokumen identitas sesuai dengan nama di tiket",
                "Check-in online untuk menghemat waktu di bandara",
                "Siapkan bagasi sesuai ketentuan maskapai",
                "Download boarding pass sebelum ke bandara"
            ]
        }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            faq.a.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setFormStatus('sending');
        
        // Simulasi pengiriman form
        setTimeout(() => {
            setFormStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setFormStatus(''), 3000);
        }, 1500);
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        setChatMessages([...chatMessages, { sender: 'user', text: chatInput }]);
        
        // Simulasi respons bot
        setTimeout(() => {
            const responses = [
                "Terima kasih atas pertanyaan Anda. Tim kami akan segera membantu.",
                "Saya sudah mencatat pertanyaan Anda. Ada yang bisa saya bantu lagi?",
                "Untuk informasi lebih detail, silakan hubungi customer service kami.",
                "Pertanyaan Anda akan dijawab oleh tim support dalam beberapa menit."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setChatMessages(prev => [...prev, { sender: 'bot', text: randomResponse }]);
        }, 1000);

        setChatInput('');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Pusat Bantuan</h1>

            {/* Search Bar */}
            <div className={styles.searchSection}>
                <div className={styles.searchBox}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Cari pertanyaan atau topik bantuan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div className={styles.categoryFilter}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`${styles.categoryBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* FAQ Section */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Pertanyaan Umum (FAQ)</h2>
                <div className={styles.faqList}>
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div key={index} className={styles.faqItem}>
                                <button
                                    className={styles.faqQuestion}
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                >
                                    {faq.q}
                                    <span>{openIndex === index ? '-' : '+'}</span>
                                </button>
                                {openIndex === index && (
                                    <div className={styles.faqAnswer}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={styles.noResults}>
                            <p>Tidak ada hasil yang ditemukan untuk pencarian "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Step-by-Step Guides */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Panduan Lengkap</h2>
                <div className={styles.guidesGrid}>
                    {guides.map((guide, index) => (
                        <div key={index} className={styles.guideCard}>
                            <div className={styles.guideIcon}>{guide.icon}</div>
                            <h3 className={styles.guideTitle}>{guide.title}</h3>
                            <ol className={styles.guideSteps}>
                                {guide.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Form */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Kirim Pertanyaan</h2>
                <form onSubmit={handleFormSubmit} className={styles.contactForm}>
                    <div className={styles.formGroup}>
                        <label>Nama Lengkap</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Subjek</label>
                        <select
                            value={formData.subject}
                            onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            required
                        >
                            <option value="">Pilih subjek</option>
                            <option value="checkin">Masalah Check-In</option>
                            <option value="refund">Permintaan Refund</option>
                            <option value="bagasi">Pertanyaan Bagasi</option>
                            <option value="pembayaran">Masalah Pembayaran</option>
                            <option value="lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Pesan</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            rows="5"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className={styles.submitBtn}
                        disabled={formStatus === 'sending'}
                    >
                        {formStatus === 'sending' ? 'Mengirim...' : 'Kirim Pertanyaan'}
                    </button>
                    {formStatus === 'success' && (
                        <div className={styles.successMessage}>
                            ✓ Pesan berhasil dikirim! Kami akan merespons dalam 24 jam.
                        </div>
                    )}
                </form>
            </section>

            {/* Contact Info */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Hubungi Kami</h2>
                <div className={styles.contactGrid}>
                    <div className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        </div>
                        <h3>Call Center</h3>
                        <p>+62 21 555 1234</p>
                        <small>24/7 Tersedia</small>
                    </div>
                    <div className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                        </div>
                        <h3>Email</h3>
                        <p>support@resshatoqger.com</p>
                        <small>Respon dalam 24 jam</small>
                    </div>
                    <div className={styles.contactCard}>
                        <div className={styles.contactIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        </div>
                        <h3>Lokasi</h3>
                        <p>Bandara ResshaToQger, Jakarta</p>
                        <small>Senin - Minggu, 06:00 - 22:00</small>
                    </div>
                </div>
            </section>

            {/* Live Chat Button */}
            <button 
                className={styles.liveChatBtn}
                onClick={() => setShowLiveChat(!showLiveChat)}
            >
                💬
            </button>

            {/* Live Chat Window */}
            {showLiveChat && (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>
                        <h3>Chat Bantuan</h3>
                        <button onClick={() => setShowLiveChat(false)}>✕</button>
                    </div>
                    <div className={styles.chatMessages}>
                        {chatMessages.map((msg, i) => (
                            <div key={i} className={`${styles.chatMessage} ${styles[msg.sender]}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleChatSubmit} className={styles.chatInputForm}>
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ketik pesan..."
                        />
                        <button type="submit">➤</button>
                    </form>
                </div>
            )}
        </div>
    );
}