"use client";
import { useState, useEffect } from 'react';
import FlightSearch from "@/components/FlightSearch";
import styles from "./page.module.css";
import Image from "next/image";

export default function Home() {
  // Gimmick 1: Dynamic Hero Text
  const words = ["Dunia", "Indonesia", "Eropa", "Asia"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Gimmick 2: Simple CountUp Animation for Stats (Simulated)
  const [count, setCount] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const end = 500;
    let start = 0;
    const timer = setInterval(() => {
      start += 10;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setCount(start);
    }, 30);
    return () => clearInterval(timer);
  }, []);
  const recommendations = [
    {
      id: 1,
      city: "Bali",
      price: "IDR 1.200.000",
      date: "12 Feb - 19 Feb",
      image: "/dest-bali.png"
    },
    {
      id: 2,
      city: "Tokyo",
      price: "IDR 5.800.000",
      date: "10 Mar - 20 Mar",
      image: "/dest-tokyo.png"
    },
    {
      id: 3,
      city: "Singapore",
      price: "IDR 1.500.000",
      date: "15 Apr - 18 Apr",
      image: "/dest-singapore.png"
    },
    {
      id: 4,
      city: "Bangkok",
      price: "IDR 2.100.000",
      date: "05 May - 12 May",
      image: "/dest-bangkok.png"
    },
    {
      id: 5,
      city: "Seoul",
      price: "IDR 4.500.000",
      date: "20 Jun - 27 Jun",
      image: "/dest-seoul.png"
    },
    {
      id: 6,
      city: "Dubai",
      price: "IDR 6.200.000",
      date: "15 Jul - 25 Jul",
      image: "/dest-dubai.png"
    }
  ];

  const features = [
    {
      title: "Harga Terbaik",
      desc: "Jaminan harga kompetitif tanpa biaya tersembunyi untuk setiap pemesanan.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
      )
    },
    {
      title: "Layanan 24/7",
      desc: "Tim support kami siap membantu Anda kapanpun dan dimanapun Anda berada.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
      )
    },
    {
      title: "Transaksi Aman",
      desc: "Sistem pembayaran terenkripsi menjamin keamanan data dan transaksi Anda.",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
      )
    }
  ];

  const airlines = [
    { name: "Garuda Indonesia", logo: "/airline-garuda.png" },
    { name: "Lion Air", logo: "/airline-lion.png" },
    { name: "AirAsia", logo: "/airline-airasia.png" },
    { name: "Citilink", logo: "/airline-citilink.png" },
    { name: "Batik Air", logo: "/airline-batik.png" },
    { name: "Singapore Airlines", logo: "/airline-singapore.png" }
  ];

  const travelTips = [
    {
      title: "Tips Hemat Booking Tiket Pesawat",
      desc: "Pelajari cara mendapatkan harga terbaik dengan memesan di waktu yang tepat.",
      image: "/tip-booking.png",
      readTime: "5 menit"
    },
    {
      title: "Persiapan Dokumen Perjalanan",
      desc: "Checklist lengkap dokumen yang perlu disiapkan sebelum terbang.",
      image: "/tip-documents.png",
      readTime: "4 menit"
    },
    {
      title: "Packing Smart untuk Liburan",
      desc: "Tips mengemas barang dengan efisien dan sesuai aturan maskapai.",
      image: "/tip-packing.png",
      readTime: "6 menit"
    }
  ];

  const statistics = [
    { number: "500K+", label: "Pengguna Aktif" },
    { number: "1M+", label: "Tiket Terjual" },
    { number: "100+", label: "Destinasi" },
    { number: "4.8/5", label: "Rating Pengguna" }
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      role: "Frequent Flyer",
      text: "Pengalaman memesan tiket di ResshaToQger sangat mudah dan cepat. Harganya juga bersaing!",
      initial: "BS"
    },
    {
      name: "Siti Aminah",
      role: "Traveling Mom",
      text: "Sangat terbantu dengan CS yang ramah saat saya perlu reschedule tiket liburan keluarga.",
      initial: "SA"
    },
    {
      name: "Rizky Pratama",
      role: "Business Traveler",
      text: "Aplikasi yang clean dan tidak ribet. Sangat cocok untuk saya yang sering dinas luar kota.",
      initial: "RP"
    }
  ];

  const faqs = [
    {
      question: "Bagaimana cara memesan tiket di ResshaToQger?",
      answer: "Cukup masukkan rute penerbangan, pilih tanggal, bandingkan harga, dan lakukan pembayaran. Sangat mudah!"
    },
    {
      question: "Apakah bisa reschedule atau refund tiket?",
      answer: "Ya, tergantung kebijakan maskapai. Hubungi CS kami untuk bantuan reschedule atau refund tiket Anda."
    },
    {
      question: "Metode pembayaran apa saja yang tersedia?",
      answer: "Kami menerima transfer bank, kartu kredit/debit, e-wallet, dan cicilan untuk kemudahan Anda."
    },
    {
      question: "Apakah ada biaya tambahan saat booking?",
      answer: "Tidak ada biaya tersembunyi. Harga yang tertera sudah termasuk pajak dan booking fee."
    }
  ];

  return (
    <>
      <section className={styles.hero}>
        <div className={`${styles.heroContent} ${styles.animateFadeIn}`}>
          <h1 className={styles.heroTitle}>
            Jelajahi <span className={styles.textGradient}>{words[currentWordIndex]}</span> Bersama <span style={{ color: '#e63946' }}>ResshaToQger</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Temukan penerbangan terbaik dengan harga terjangkau dan pelayanan kelas dunia.
          </p>
        </div>
      </section>

      <section className="container">
        <FlightSearch />
      </section>

      {/* Statistics Section */}
      <section className={`container ${styles.statsSection} ${styles.animateFadeIn}`}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>{count}K+</div>
            <div className={styles.statLabel}>Pengguna Aktif</div>
          </div>
          {statistics.slice(1).map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Mengapa Memilih Kami?</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Section */}
      <div className="container">
        <section className={styles.promoSection}>
          <div className={styles.promoContent}>
            <h2 className={styles.promoTitle}>Promo Liburan Jepang!</h2>
            <p className={styles.promoText}>Dapatkan diskon hingga 20% untuk penerbangan ke Tokyo dan Osaka. Periode terbatas.</p>
            <button className={styles.promoBtn}>Lihat Penawaran</button>
          </div>
        </section>
      </div>

      {/* Destinations */}
      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Destinasi Populer</h2>
        <p className={styles.sectionSubtitle}>
          Temukan berbagai destinasi impian dengan harga spesial
        </p>
        <div className={styles.recommendationsGrid}>
          {recommendations.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardImage}>
                <Image
                  src={item.image}
                  alt={item.city}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={styles.cardBadge}>Populer</div>
                <div className={styles.liveTimeBadge}>
                    <div className={styles.liveIndicator}></div>
                    LIVE
                </div>
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardCity}>{item.city}</h3>
                <p className={styles.cardDate}>{item.date}</p>
                <p className={styles.cardPrice}>Mulai {item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Airlines Partners */}
      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Maskapai Partner Kami</h2>
        <p className={styles.sectionSubtitle}>
          Bekerja sama dengan maskapai terpercaya untuk kenyamanan perjalanan Anda
        </p>
        <div className={styles.marqueeContainer}>
          <div className={styles.marqueeContent}>
            {[...airlines, ...airlines].map((airline, index) => (
              <div key={index} className={styles.airlineCard} style={{ minWidth: '200px' }}>
                <div className={styles.airlineLogo}>
                  <Image
                    src={airline.logo}
                    alt={airline.name}
                    width={120}
                    height={60}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Tips */}
      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Tips & Panduan Perjalanan</h2>
        <p className={styles.sectionSubtitle}>
          Informasi berguna untuk mempersiapkan perjalanan Anda
        </p>
        <div className={styles.tipsGrid}>
          {travelTips.map((tip, index) => (
            <div key={index} className={styles.tipCard}>
              <div className={styles.tipImage}>
                <Image
                  src={tip.image}
                  alt={tip.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.tipContent}>
                <div className={styles.tipMeta}>
                  <span className={styles.tipReadTime}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    {tip.readTime}
                  </span>
                </div>
                <h3 className={styles.tipTitle}>{tip.title}</h3>
                <p className={styles.tipDesc}>{tip.desc}</p>
                <button className={styles.tipLink}>Baca Selengkapnya →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Apa Kata Mereka?</h2>
        <p className={styles.sectionSubtitle}>
          Testimoni dari ribuan pelanggan yang puas dengan layanan kami
        </p>
        <div className={styles.testimonialGrid}>
          {testimonials.map((testi, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                ))}
              </div>
              <p className={styles.testimonialText}>"{testi.text}"</p>
              <div className={styles.user}>
                <div className={styles.avatar}>{testi.initial}</div>
                <div className={styles.userInfo}>
                  <h4>{testi.name}</h4>
                  <p>{testi.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>Pertanyaan yang Sering Diajukan</h2>
        <p className={styles.sectionSubtitle}>
          Temukan jawaban untuk pertanyaan umum seputar layanan kami
        </p>
        <div className={styles.faqGrid}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqCard}>
              <h3 className={styles.faqQuestion}>{faq.question}</h3>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <div className="container">
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Siap Memulai Petualangan Anda?</h2>
            <p className={styles.ctaText}>
              Daftar sekarang dan dapatkan voucher diskon Rp 100.000 untuk pemesanan pertama Anda!
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.ctaBtnPrimary}>Daftar Sekarang</button>
              <button className={styles.ctaBtnSecondary}>Download Aplikasi</button>
            </div>
          </div>
        </section>
      </div>

      {/* Newsletter */}
      <section className={`container ${styles.section}`} style={{ paddingBottom: '100px' }}>
        <div className={styles.newsletterBox}>
          <h2 className={styles.newsletterTitle}>Dapatkan Penawaran Terbaik</h2>
          <p className={styles.newsletterText}>
            Subscribe newsletter kami dan dapatkan update promo eksklusif langsung di email Anda
          </p>
          <div className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className={styles.newsletterInput}
            />
            <button className={styles.newsletterBtn}>Subscribe</button>
          </div>
        </div>
      </section>
    </>
  );
}