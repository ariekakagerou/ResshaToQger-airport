"use client";
import Link from 'next/link';
import { useState } from 'react';
import styles from '../auth.module.css';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });

        // Simple password strength calculation
        if (id === 'password') {
            let strength = 0;
            if (value.length > 5) strength += 20;
            if (value.length > 8) strength += 20;
            if (/[A-Z]/.test(value)) strength += 20;
            if (/[0-9]/.test(value)) strength += 20;
            if (/[^A-Za-z0-9]/.test(value)) strength += 20;
            setPasswordStrength(strength);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Kata sandi tidak cocok!');
            return;
        }
        setLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
            const response = await fetch(`${apiUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.confirmPassword // Laravel usually expects this or just password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Pendaftaran gagal');
                // Could also display validation errors from data.errors
            }

            // Success
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user', JSON.stringify(data.data));

            alert('Pendaftaran Berhasil! Selamat datang ' + data.data.name + ' ✈️');
            window.location.href = '/'; // Redirect to home

        } catch (error) {
            console.error('Registration error:', error);
            alert('Terjadi kesalahan: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        alert(`Daftar dengan ${provider} (Fitur dalam pengembangan)`);
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

                <h1 className={styles.title}>Buat Akun Baru</h1>
                <p className={styles.subtitle}>Mulai petualangan Anda bersama kami</p>

                {/* Welcome/Promo Banner */}
                <div className={styles.welcomeBanner} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 6px -1px rgb(16 185 129 / 0.3)' }}>
                    <div className={styles.giftIcon}>🎁</div>
                    <div className={styles.welcomeText}>
                        <strong>Bonus Pendaftaran!</strong>
                        <p>Dapatkan 1.000 Miles gratis untuk pendaftar baru hari ini.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="name">
                            Nama Lengkap
                        </label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>👤</span>
                            <input
                                id="name"
                                type="text"
                                placeholder="Jhon Doe"
                                className={styles.inputWithIcon}
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

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
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="password">
                            Kata Sandi
                        </label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>🔒</span>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={styles.inputWithIcon}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {formData.password && (
                            <div className={styles.passwordStrength}>
                                <div className={styles.strengthBar}>
                                    <div
                                        className={styles.strengthFill}
                                        style={{
                                            width: `${passwordStrength}%`,
                                            background: passwordStrength < 40 ? '#ef4444' : passwordStrength < 80 ? '#f59e0b' : '#10b981'
                                        }}
                                    ></div>
                                </div>
                                <span className={styles.strengthText} style={{ color: passwordStrength < 40 ? '#ef4444' : passwordStrength < 80 ? '#f59e0b' : '#10b981' }}>
                                    {passwordStrength < 40 ? 'Lemah' : passwordStrength < 80 ? 'Sedang' : 'Kuat'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label} htmlFor="confirmPassword">
                            Konfirmasi Kata Sandi
                        </label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>🔒</span>
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={styles.inputWithIcon}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
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
                                <span>Daftar Sekarang</span>
                                <span>🚀</span>
                            </>
                        )}
                    </button>
                </form>

                <div className={styles.divider}>atau daftar dengan</div>

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

                <div className={styles.footerText}>
                    Sudah punya akun?
                    <Link href="/auth/login" className={styles.link}>
                        Masuk disini
                    </Link>
                </div>

                {/* Trust Badges */}
                <div className={styles.trustBadges}>
                    <span className={styles.badge}>🔒 Privasi Dijamin</span>
                    <span className={styles.badge}>✓ Verifikasi Cepat</span>
                </div>
            </div>
        </div>
    );
}
