"use client";

import { useState, useEffect } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Check Real Auth
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAccount = () => setIsAccountOpen(!isAccountOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsAccountOpen(false);
    window.location.href = '/auth/login';
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <div className={styles.topBarLeft}>
            <div className={styles.topBarItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+62 123 4567 890</span>
            </div>
            <div className={styles.topBarItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Bogor, Indonesia</span>
            </div>
          </div>
          <div className={styles.topBarItem}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{currentTime ? currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
          </div>
        </div>
      </div>

      <div className={styles.mainHeader}>
        <div className={styles.container}>
          <a href="/" className={styles.logo}>
            <div className={styles.logoIcon}>✈</div>
            <div className={styles.logoText}>
              <div className={styles.logoTitle}>ResshaToQger</div>
              <div className={styles.logoSubtitle}>International Airport</div>
            </div>
          </a>

          <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
            <a href="/" className={styles.navLink}>Beranda</a>
            <a href="/penerbangan" className={styles.navLink}>Penerbangan</a>
            <a href="/jadwal" className={styles.navLink}>Jadwal</a>
            <a href="/bantuan" className={styles.navLink}>Bantuan</a>

            <div className={styles.accountWrapper}>
              <button className={styles.accountBtn} onClick={toggleAccount}>
                <div className={styles.accountIcon}>
                  {isLoggedIn ? '👤' : '👋'}
                </div>
                <span>{isLoggedIn ? (user?.name?.split(' ')[0] || 'Akun') : 'Akun'}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    transform: isAccountOpen ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s'
                  }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {isAccountOpen && (
                <div className={styles.dropdown}>
                  {!isLoggedIn ? (
                    <>
                      <div className={styles.dropdownHeader}>Selamat Datang</div>
                      <a href="/auth/login" className={styles.dropdownItem} onClick={() => setIsAccountOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                        </svg>
                        Masuk
                      </a>
                      <a href="/auth/register" className={styles.dropdownItem} onClick={() => setIsAccountOpen(false)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6" />
                        </svg>
                        Daftar
                      </a>
                    </>
                  ) : (
                    <>
                      <div className={styles.dropdownHeader}>Menu Akun</div>
                      {user?.role === 'admin' || user?.role === 'super_admin' ? (
                        <a href="/admin/dashboard" className={styles.dropdownItem}>
                          🔥 Dashboard Admin
                        </a>
                      ) : null}
                      <a href="/akun/profil" className={styles.dropdownItem}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                        </svg>
                        Profil Saya
                      </a>
                      <div className={styles.dropdownDivider}></div>
                      <div className={styles.dropdownHeader} style={{ fontSize: '0.8rem', padding: '8px 16px' }}>Pemesanan Saya</div>
                      <a href="/akun/pemesanan/aktif" className={styles.dropdownItem} style={{ paddingLeft: '28px' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Pemesanan Aktif
                      </a>
                      <a href="/akun/pemesanan/etiket" className={styles.dropdownItem} style={{ paddingLeft: '28px' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        E-Tiket
                      </a>
                      <div className={styles.dropdownDivider}></div>
                      <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logout}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                        Keluar
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <a href="/check-in" className={styles.actionBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Check-In
            </a>
          </nav>

          <button className={`${styles.mobileToggle} ${isMenuOpen ? styles.openToggle : ''}`} onClick={toggleMenu}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}