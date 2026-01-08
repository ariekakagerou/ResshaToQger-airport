"use client";
import Link from 'next/link';
import { useState } from 'react';
import styles from '../auth.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Email atau kata sandi salah.');
                }
                throw new Error(data.message || 'Login gagal');
            }

            // Success
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.data));

            alert('Login Berhasil! Selamat datang kembali ' + data.data.name + ' ✈️');
            window.location.href = '/'; // Redirect to home

        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        alert(`Login dengan ${provider} (Fitur dalam pengembangan)`);
    };

    return (
        <div className={styles.authContainer}>
            {/* Animated Background Elements */}
            <div className={styles.floatingPlane}>✈️</div>
            <div className={styles.floatingCloud}>☁️</div>

            <div className={styles.authCard}>
                {/* Logo/Icon */}
                <div className={styles.logoContainer}>
                    <div className={styles.logoIcon}>🛫</div>
                </div>

                <h1 className={styles.title}>Selamat Datang Kembali</h1>
                <p className={styles.subtitle}>Masuk untuk melanjutkan perjalanan Anda</p>

                {error && <div className={styles.errorAlert}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="email">
                            Email
                        </label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>📧</span>
                            <input
                                id="email"
                                type="email"
                                placeholder="nama@email.com"
                                className={styles.inputWithIcon}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className={styles.label} htmlFor="password">
                                Kata Sandi
                            </label>
                            <Link href="/auth/forgot-password" className={styles.forgotLink}>
                                Lupa kata sandi?
                            </Link>
                        </div>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>🔒</span>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={styles.inputWithIcon}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.rememberMeContainer}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className={styles.checkbox}
                            />
                            <span>Ingat saya</span>
                        </label>
                        <div className={styles.secureNote}>
                            <span className={styles.secureIcon}>🔐</span>
                            <span>Koneksi aman</span>
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? (
                            <span className={styles.loadingSpinner}>
                                <span className={styles.spinner}></span>
                                Memproses...
                            </span>
                        ) : (
                            <>
                                <span>Masuk</span>
                                <span>→</span>
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.divider}>atau masuk dengan</div>

                <div className={styles.socialButtons}>
                    <button
                        className={styles.socialBtn}
                        onClick={() => handleSocialLogin('Google')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M23.52 12.29c0-.85-.08-1.71-.23-2.5h-11.3v4.71h6.45c-.28 1.48-1.12 2.74-2.39 3.6v2.99h3.87c2.26-2.08 3.57-5.15 3.57-8.8z" fill="#4285F4" />
                            <path d="M11.99 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-2.99c-1.08.72-2.46 1.15-4.08 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.13C3.23 21.41 7.29 24 11.99 24z" fill="#34A853" />
                            <path d="M5.26 14.29c-.25-.74-.39-1.53-.39-2.29s.14-1.55.39-2.29V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4-3.13z" fill="#FBBC05" />
                            <path d="M11.99 4.75c1.76 0 3.35.6 4.6 1.79l3.41-3.41C17.95 1.18 15.23 0 11.99 0 7.29 0 3.23 2.59 1.26 6.58l4 3.13c.96-2.85 3.6-4.96 6.73-4.96z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>

                    <button
                        className={styles.socialBtn}
                        onClick={() => handleSocialLogin('Facebook')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                    </button>

                    <button
                        className={styles.socialBtn}
                        onClick={() => handleSocialLogin('Apple')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                        </svg>
                        Apple
                    </button>
                </div>

                {/* Benefits Section */}
                <div className={styles.benefitsSection}>
                    <p className={styles.benefitsTitle}>Keuntungan Member:</p>
                    <div className={styles.benefitsList}>
                        <div className={styles.benefitItem}>
                            <span>🎫</span>
                            <span>Diskon khusus member</span>
                        </div>
                        <div className={styles.benefitItem}>
                            <span>⚡</span>
                            <span>Check-in lebih cepat</span>
                        </div>
                        <div className={styles.benefitItem}>
                            <span>🎁</span>
                            <span>Point reward setiap transaksi</span>
                        </div>
                    </div>
                </div>

                <div className={styles.footerText}>
                    Belum punya akun?
                    <Link href="/auth/register" className={styles.link}>
                        Daftar sekarang
                    </Link>
                </div>

                {/* Trust Badges */}
                <div className={styles.trustBadges}>
                    <span className={styles.badge}>🔒 Data Terenkripsi</span>
                    <span className={styles.badge}>✓ Terpercaya</span>
                </div>
            </div>
        </div>
    );
}