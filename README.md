# ✈️ Sistem Informasi Manajemen Bandara Internasional ResshaToQger
> **Tugas Besar / UAS - Web Software Tools**

Sistem Informasi Manajemen Bandara Internasional ResshaToQger adalah aplikasi berbasis web yang dirancang untuk mengintegrasikan berbagai aspek operasional bandara, mulai dari pencarian jadwal penerbangan oleh penumpang hingga manajemen tugas internal karyawan dan verifikasi keuangan oleh administrator.

Proyek ini mendemonstrasikan implementasi arsitektur **Microservices**, **Containerization**, dan **RESTful API** menggunakan teknologi *state-of-the-art*.

---

## 🛠️ Stack Teknologi & Software Tools

Proyek ini dibangun menggunakan berbagai *software tools* modern untuk memastikan efisiensi pengembangan dan skalabilitas sistem:

| Komponen | Teknologi / Tool | Deskripsi |
| :--- | :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/) | Framework React untuk pembuatan UI yang responsif dan SEO-friendly. |
| **Backend** | [Laravel 11](https://laravel.com/) | Framework PHP untuk membangun RESTful API yang aman dan terstruktur. |
| **Database** | [MySQL 8.0](https://www.mysql.com/) | Sistem manajemen database relasional untuk menyimpan data master & transaksi. |
| **Web Server** | [Nginx](https://www.nginx.com/) | Bertindak sebagai Reverse Proxy dan Load Balancer antar layanan. |
| **Containerization** | [Docker](https://www.docker.com/) | Membungkus aplikasi ke dalam container agar konsisten di berbagai environment. |
| **API Testing** | [Postman](https://www.getpostman.com/) | Digunakan untuk dokumentasi dan pengujian otomatis titik akhir API. |
| **Styling** | Vanilla CSS & Modules | Pendekatan desain bersih dan modern tanpa library eksternal berlebih. |

---

## 🌟 Fitur Unggulan

### 1. Modul Penumpang (Layanan Publik)
*   **Search Engine Cerdas**: Pencarian jadwal penerbangan dinamis berdasarkan asal, tujuan, dan tanggal.
*   **Advanced Booking**: Pemesanan tiket untuk banyak penumpang dengan kalkulasi otomatis biaya admin (Rp 25.000) dan subtotal.
*   **E-Billing & Payment Proof**: Sistem tagihan (invoice) otomatis dan fitur upload bukti transfer bank (Image Upload).
*   **Interactive Seat Map**: Pemilihan kursi pesawat (Check-in) secara visual dengan status kursi *real-time* (Terisi/Kosong).
*   **E-Ticket System**: Boarding pass digital yang terbit secara otomatis setelah verifikasi pembayaran.

### 2. Modul Administrator & Staff (Internal Management)
*   **Executive Dashboard**: Visualisasi statistik pendapatan, grafik penjualan 7 hari terakhir, dan monitoring aktivitas terbaru.
*   **Master Data Management (CRUD)**: Kontrol penuh atas data Bandara, Maskapai (Airlines), dan Jadwal Penerbangan.
*   **Payment Verification**: Panel khusus bagi admin untuk memvalidasi bukti transfer penumpang (Approve/Reject).
*   **Task Management System**: Workflow penugasan tugas dari Super Admin ke staff operasional dengan status tracking (*Pending*, *In Progress*, *Completed*).
*   **Role-Based Access Control (RBAC)**: Pembatasan akses fitur berdasarkan peran (Super Admin, Operator, Customer Service, & Reguler User).

---

## 🏗️ Arsitektur Sistem

Aplikasi ini berjalan di atas ekosistem Docker dengan konfigurasi sebagai berikut:

- **Layanan `ui-service`**: Berjalan pada port `3000`. Mengonsumsi API dari port `8080`.
- **Layanan `api-service`**: Framework Laravel yang melayani request data ke `db`.
- **Layanan `nginx`**: Entry point utama yang meneruskan request ke Frontend (`/`) atau Backend (`/api`).
- **Layanan `db`**: Database MySQL yang persisten menggunakan Docker Volumes.

---

## 🚀 Panduan Instalasi (Development)

### Prasyarat
- Docker & Docker Desktop terinstal.
- Git terinstal.

### Langkah-langkah
1.  **Clone Repository**
    ```bash
    git clone https://github.com/ariekakagerou/ResshaToQger-airport.git
    cd bpjs_pengguna
    ```

2.  **Konfigurasi Environment**
    - Copy `.env.example` di dalam `api-service` menjadi `.env`.
    - Pastikan port `8080` dan `3000` sedang tidak digunakan oleh aplikasi lain.

3.  **Build & Run dengan Docker Compose**
    ```bash
    docker-compose up -d --build
    ```

4.  **Inisialisasi Database**
    Jalankan perintah berikut di terminal (dalam container api-service):
    ```bash
    docker exec -it resshatoqger-api php artisan migrate:fresh --seed
    ```

Sistem dapat diakses di:
- **Web UI**: `http://localhost:3000`
- **API Endpoint**: `http://localhost:8080/api`

---

## 🧪 Dokumentasi & Pengujian API

Dokumentasi API tersedia dalam format **Postman Collection**.
- File: `resshatoqger-airport-api.postman_collection.json`
- Impor file tersebut ke Postman untuk melihat daftar lengkap endpoint beserta contoh request body-nya.

---

## ✍️ Penutup
Proyek ini dikembangkan untuk memenuhi indikator penilaian **UAS Web Software Tools**, dengan fokus pada integrasi antar alat pengembangan, manajemen kontainer, dan pengembangan aplikasi web skala penuh (*Full-Stack Development*).

**Disusun Oleh:**
- **Nama:** Ari eka prianda  
- **NPM:** 12522045  
- **Program Studi:** Teknik Informatika
