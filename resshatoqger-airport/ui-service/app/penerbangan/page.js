"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function FlightsPage() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortBy, setSortBy] = useState('departure');
  const [filterAirline, setFilterAirline] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000000]); // Increased max range
  const [selectedFlight, setSelectedFlight] = useState(null);

  // Get query params
  const originCode = searchParams.get('origin') || '';
  const destinationCode = searchParams.get('destination') || '';
  const dateQuery = searchParams.get('date') || '';

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
        // Construct API URL with params
        const query = new URLSearchParams({
          ...(originCode && { origin: originCode }),
          ...(destinationCode && { destination: destinationCode }),
          ...(dateQuery && { date: dateQuery })
        }).toString();

        const response = await fetch(`${apiUrl}/flights?${query}`);
        if (!response.ok) throw new Error('Gagal mengambil data penerbangan');

        const json = await response.json();
        const data = json.data || [];

        // Map API response to UI format
        const mappedFlights = data.map(f => {
          const dep = new Date(f.departure_time);
          const arr = new Date(f.arrival_time);

          // Calculate duration
          const durationMs = arr - dep;
          const durationHrs = Math.floor(durationMs / 3600000);
          const durationMins = Math.round((durationMs % 3600000) / 60000);

          return {
            id: f.id,
            airline: f.airline.name,
            logo: f.airline.logo,
            code: f.flight_number,
            origin: `${f.origin.city || ''} (${f.origin.code})`,
            destination: `${f.destination.city || ''} (${f.destination.code})`,
            departureTime: dep.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            arrivalTime: arr.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            duration: `${durationHrs}j ${durationMins}m`,
            price: parseFloat(f.price),
            class: "Economy", // Default for now
            baggage: "20kg",  // Default
            cabinBaggage: "7kg", // Default
            seats: f.capacity, // Using capacity as seats for now
            amenities: ["Meals", "Entertainment"] // Default
          };
        });

        setFlights(mappedFlights);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [originCode, destinationCode, dateQuery]);

  const formatPrice = (price) => {
    return `IDR ${price.toLocaleString('id-ID')}`;
  };

  const getFilteredFlights = () => {
    let filtered = flights;

    if (filterAirline !== 'all') {
      filtered = filtered.filter(f => f.airline === filterAirline);
    }

    filtered = filtered.filter(f => f.price >= priceRange[0] && f.price <= priceRange[1]);

    return filtered;
  };

  const getSortedFlights = (flightList) => {
    const sorted = [...flightList];

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'departure':
        return sorted.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
      case 'duration':
        // Simple string comparison for duration "Xh Ym" works roughly ok if hours are single digits, 
        // but robust parsing matches better. For now keeping it simple or relying on loaded data logic.
        return sorted.sort((a, b) => a.duration.localeCompare(b.duration));
      default:
        return sorted;
    }
  };

  const displayFlights = getSortedFlights(getFilteredFlights());
  const airlines = ['all', ...new Set(flights.map(f => f.airline))];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Sedang mencari penerbangan terbaik...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <p>Terjadi kesalahan: {error}</p>
          <button onClick={() => window.location.reload()} className={styles.resetBtn}>Coba Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Hasil Pencarian Penerbangan</h1>
        <p className={styles.subtitle}>
          {originCode} ke {destinationCode}
          {dateQuery && ` - ${new Date(dateQuery).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`}
        </p>
        <p className={styles.resultCount}>{displayFlights.length} penerbangan ditemukan</p>
      </header>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Urutkan:</label>
          <select
            className={styles.filterSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="departure">Keberangkatan Paling Awal</option>
            <option value="price-low">Harga Termurah</option>
            <option value="price-high">Harga Termahal</option>
            <option value="duration">Durasi Terpendek</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Maskapai:</label>
          <select
            className={styles.filterSelect}
            value={filterAirline}
            onChange={(e) => setFilterAirline(e.target.value)}
          >
            <option value="all">Semua Maskapai</option>
            {airlines.slice(1).map(airline => (
              <option key={airline} value={airline}>{airline}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Harga Maksimal:</label>
          <input
            type="range"
            className={styles.priceRange}
            min="0"
            max="5000000"
            step="100000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          />
          <span className={styles.priceRangeValue}>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <div className={styles.flightList}>
        {displayFlights.map((flight, index) => (
          <div
            key={flight.id}
            className={`${styles.flightCard} ${styles.animateCard}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={styles.airlineInfo}>
              <div className={styles.airlineLogo}>
                {flight.logo ? (
                  <img
                    src={flight.logo}
                    alt={flight.airline}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : (
                  flight.code.split('-')[0]
                )}
                {/* Fallback code if image fails (hidden by default if img exists) */}
                <span style={{ display: flight.logo ? 'none' : 'block' }}>{flight.code.split('-')[0]}</span>
              </div>
              <div>
                <div className={styles.airlineName}>{flight.airline}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{flight.code}</div>
                {flight.airline === 'Garuda Indonesia' && (
                  <div className={styles.verifiedBadge}>
                    <span>✓</span> Official Partner
                  </div>
                )}
              </div>
            </div>

            <div className={styles.routeInfo}>
              <div>
                <div className={styles.time}>{flight.departureTime}</div>
                <div className={styles.airport}>{flight.origin.split('(')[1].replace(')', '')}</div>
              </div>

              <div className={styles.duration}>
                <span>{flight.duration}</span>
                <div className={styles.durationLine}></div>
                <span style={{ fontSize: '0.7rem' }}>Langsung</span>
              </div>

              <div>
                <div className={styles.time}>{flight.arrivalTime}</div>
                <div className={styles.airport}>{flight.destination.split('(')[1].replace(')', '')}</div>
              </div>
            </div>

            <div className={styles.actionArea}>
              <div className={styles.price}>{formatPrice(flight.price)}</div>
              <div className={styles.seatsInfo}>
                {flight.seats} kursi tersisa
              </div>
              <button
                className={styles.selectBtn}
                onClick={() => setSelectedFlight(flight.id === selectedFlight ? null : flight.id)}
              >
                {selectedFlight === flight.id ? 'Tutup Detail' : 'Lihat Detail'}
              </button>
            </div>

            {selectedFlight === flight.id && (
              <div className={styles.flightDetails}>
                <div className={styles.detailSection}>
                  <h4 className={styles.detailTitle}>Informasi Bagasi</h4>
                  <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>🧳</span>
                      <div>
                        <div className={styles.detailLabel}>Bagasi Kabin</div>
                        <div className={styles.detailValue}>{flight.cabinBaggage}</div>
                      </div>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailIcon}>💼</span>
                      <div>
                        <div className={styles.detailLabel}>Bagasi Check-in</div>
                        <div className={styles.detailValue}>{flight.baggage}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <h4 className={styles.detailTitle}>Fasilitas</h4>
                  <div className={styles.amenitiesList}>
                    {flight.amenities.map((amenity, idx) => (
                      <span key={idx} className={styles.amenityTag}>{amenity}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.detailSection}>
                  <h4 className={styles.detailTitle}>Kelas Penerbangan</h4>
                  <div className={styles.detailValue}>{flight.class}</div>
                </div>

                <button
                  className={styles.bookBtn}
                  onClick={() => {
                    // Check if user is logged in (optional check here, also checked on booking page)
                    const token = localStorage.getItem('token');
                    if (!token) {
                      if (confirm('Anda perlu login untuk memesan tiket. Lanjut ke halaman login?')) {
                        window.location.href = '/auth/login';
                      }
                      return;
                    }
                    // Navigate to booking page with flight ID
                    window.location.href = `/pemesanan?flightId=${flight.id}`;
                  }}
                >
                  Lanjutkan Pemesanan
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {displayFlights.length === 0 && (
        <div className={styles.noResults}>
          <p>Tidak ada penerbangan yang sesuai dengan filter Anda</p>
          <button
            className={styles.resetBtn}
            onClick={() => {
              setFilterAirline('all');
              setPriceRange([0, 2000000]);
            }}
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}