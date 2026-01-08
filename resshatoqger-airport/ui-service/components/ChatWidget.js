"use client";
import { useState, useRef, useEffect } from 'react';
import styles from './ChatWidget.module.css';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Halo! 👋 Saya ResshaBot. Ada yang bisa saya bantu terkait penerbangan Anda hari ini?", type: 'bot', quickReplies: ['Cek Status Penerbangan', 'Pesan Tiket', 'Pilih Kursi', 'Kebijakan Bagasi'] }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showQuickReplies, setShowQuickReplies] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [messages, isOpen, isTyping]);

    const addBotMessage = (text, options = {}) => {
        setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text,
            type: 'bot',
            ...options
        }]);
        setIsTyping(false);
    };

    const processAIResponse = async (inputText) => {
        const lowerInput = inputText.toLowerCase();
        let responseText = "";
        let responseOptions = {};

        // 1. Simulate "AI Thinking" delay (Dynamic based on complexity)
        const thinkingTime = Math.max(1000, Math.random() * 2000);
        await new Promise(r => setTimeout(r, thinkingTime));

        // 2. Intent Recognition Logic
        if (lowerInput.match(/hai|halo|helo|selamat|pagi|siang|sore|malam/)) {
            const hour = new Date().getHours();
            const greeting = hour < 12 ? "Selamat Pagi" : hour < 15 ? "Selamat Siang" : "Selamat Sore";
            responseText = `${greeting}! 🌤️ Saya ResshaBot, asisten virtual Anda. Ada yang bisa saya bantu untuk penerbangan hari ini?`;
            responseOptions = { quickReplies: ['Cek Penerbangan', 'Aturan Bagasi', 'Check-in Online'] };
        }
        else if (lowerInput.match(/status|delay|terlambat|jam berapa|flight/)) {
            responseText = "Sedang mengecek data penerbangan real-time...";
            responseOptions = {
                showFlightStatus: true,
                flightData: {
                    flightNumber: 'RS-777',
                    status: 'On Schedule',
                    route: 'CGK → HND',
                    departure: '23:45',
                    arrival: '08:15 (+1)',
                    gate: 'T3-G4'
                },
                quickReplies: ['Set Notifikasi', 'Cek Rute Lain']
            };
        }
        else if (lowerInput.match(/bagasi|koper|berat|kg/)) {
            responseText = "Untuk kelas Ekonomi, Anda mendapatkan bagasi tercatat gratis 20kg 🧳 dan kabin 7kg. Kelebihan bagasi dikenakan biaya Rp 150.000/kg.";
            responseOptions = { quickReplies: ['Beli Tambahan Bagasi', 'Info Barang Terlarang'] };
        }
        else if (lowerInput.match(/refund|batal|cancel|reschedule|ubah jadwal/)) {
            responseText = "Saya mengerti Anda ingin mengubah rencana. Untuk Refund atau Reschedule, silakan pilih opsi di bawah ini untuk terhubung ke tim spesialis kami.";
            responseOptions = {
                showActions: true,
                actions: ['Ajukan Refund', 'Reschedule Penerbangan', 'Chat dengan Agen Manusia']
            };
        }
        else if (lowerInput.match(/tiket|pesan|booking|beli|harga/)) {
            responseText = "Siap bantu liburan Anda! ✈️ Mau terbang ke mana?";
            responseOptions = { showBookingCard: true };
        }
        else if (lowerInput.match(/check-in|checkin|cek in/)) {
            responseText = "Check-in online dibuka 48 jam sebelum keberangkatan. Silakan masukkan kode booking (PNR) Anda.";
            responseOptions = { quickReplies: ['Saya punya kode PNR', 'Lupa kode booking'] };
        }
        else if (lowerInput.includes('terima kasih') || lowerInput.includes('makasih')) {
            responseText = "Sama-sama! Senang bisa membantu perjalanan Anda. ✈️👋";
        }
        else {
            responseText = "Maaf, saya masih belajar 🧠. Bisa gunakan menu di bawah atau ulangi pertanyaan Anda dengan kata kunci lain?";
            responseOptions = { quickReplies: ['Bantuan Umum', 'Hubungi CS', 'Cari Tiket'] };
        }

        addBotMessage(responseText, responseOptions);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setShowQuickReplies(false);
        const userMsg = { id: Date.now(), text: input, type: 'user' };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        setIsTyping(true); // Start typing animation

        // Call the new AI processor
        await processAIResponse(currentInput);
    };

    const handleQuickReply = (reply) => {
        setShowQuickReplies(false);
        const userMsg = { id: Date.now(), text: reply, type: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        processAIResponse(reply);
    };

    const handleSeatSelect = (seat, isTaken) => {
        if (isTaken) return;
        const userMsg = { id: Date.now(), text: `Memilih kursi ${seat}`, type: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);
        setTimeout(() => {
            addBotMessage(`Kursi ${seat} berhasil dipilih! ✅ Silakan lanjutkan ke pembayaran.`, {
                quickReplies: ['Lanjut Bayar', 'Ubah Kursi', 'Kembali ke Menu']
            });
        }, 1000);
    };

    const handleBookingSubmit = (e, fromData, toData, dateData) => {
        e.preventDefault();
        const userMsg = { id: Date.now(), text: `Booking: ${fromData} → ${toData} (${dateData})`, type: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);
        setTimeout(() => {
            addBotMessage("Analisis rute selesai. 🔍 Kami menemukan 3 penerbangan yang cocok. Mengalihkan ke halaman hasil...", {
                quickReplies: ['Selesai']
            });
        }, 1500);
    };

    return (
        <div className={styles.chatContainer}>
            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>
                        <div className={styles.chatTitle}>
                            <div className={styles.onlineIndicator}></div>
                            ResshaBot AI
                        </div>
                        <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>×</button>
                    </div>

                    <div className={styles.messageArea}>
                        {messages.map((msg, index) => (
                            <div key={msg.id}>
                                <div className={`${styles.message} ${msg.type === 'user' ? styles.userMessage : styles.botMessage}`}>
                                    {msg.text}
                                </div>

                                {/* Flight Status Card */}
                                {msg.showFlightStatus && (
                                    <div className={styles.card}>
                                        <div className={styles.cardTitle}>Status Penerbangan</div>
                                        <div className={styles.flightStatus}>
                                            <div className={styles.statusItem}>
                                                <span className={styles.statusLabel}>{msg.flightData.flightNumber}</span>
                                                <span className={styles.statusBadge}>{msg.flightData.status}</span>
                                            </div>
                                            <div className={styles.statusRoute}>{msg.flightData.route}</div>
                                            <div className={styles.statusTime}>
                                                Dep: {msg.flightData.departure} | Arr: {msg.flightData.arrival}
                                            </div>
                                            <div className={styles.statusTime} style={{ fontSize: '0.8rem' }}>Gate: {msg.flightData.gate}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Booking Card */}
                                {msg.showBookingCard && (
                                    <div className={styles.card}>
                                        <div className={styles.cardTitle}>Form Cepat Pemesanan</div>
                                        <form onSubmit={(e) => {
                                            const from = e.target.from.value;
                                            const to = e.target.to.value;
                                            const date = e.target.date.value;
                                            handleBookingSubmit(e, from, to, date);
                                        }}>
                                            <input name="from" className={styles.cardInput} placeholder="Dari (Kota/Bandara)" required />
                                            <input name="to" className={styles.cardInput} placeholder="Ke (Kota/Bandara)" required />
                                            <input name="date" type="date" className={styles.cardInput} required />
                                            <button type="submit" className={styles.cardBtn}>Cari Tiket</button>
                                        </form>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {msg.showActions && (
                                    <div className={styles.card}>
                                        {msg.actions.map((action, idx) => (
                                            <button key={idx} className={styles.actionBtn} onClick={() => handleQuickReply(action)}>
                                                {action}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Quick Replies */}
                                {msg.quickReplies && index === messages.length - 1 && showQuickReplies && (
                                    <div className={styles.quickReplies}>
                                        {msg.quickReplies.map((reply, idx) => (
                                            <button key={idx} className={styles.quickReplyBtn} onClick={() => handleQuickReply(reply)}>
                                                {reply}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div className={styles.typingIndicator}>
                                <div className={styles.typingDot}></div>
                                <div className={styles.typingDot}></div>
                                <div className={styles.typingDot}></div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className={styles.inputArea}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Tanya sesuatu..."
                            className={styles.input}
                        />
                        <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}

            <button className={styles.toggleBtn} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? (
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>
        </div>
    );
}