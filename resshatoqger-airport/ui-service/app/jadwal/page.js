'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function SchedulePage() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterDestination, setFilterDestination] = useState('all');
    const [sortBy, setSortBy] = useState('time');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

    const [scheduleData, setScheduleData] = useState([]);

    useEffect(() => {
        const fetchFlights = async () => {
            setIsLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
                const response = await fetch(`${apiUrl}/flights?date=${date}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const json = await response.json();
                const flights = json.data || [];

                const mappedFlights = flights.map(f => {
                    const departure = new Date(f.departure_time);
                    const timeString = departure.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');

                    // Simple status logic based on time
                    const now = new Date();
                    let status = 'On Time';
                    if (departure < now) status = 'Departed';
                    // In a real app, status would come from DB

                    return {
                        time: timeString,
                        flight: f.flight_number,
                        dest: `${f.destination.city || ''} (${f.destination.code})`,
                        airline: f.airline.name,
                        logo: f.airline.logo,
                        gate: '-',
                        status: status,
                        terminal: 'T2' // Default terminal
                    };
                });

                setScheduleData(mappedFlights);
            } catch (error) {
                console.error('Error fetching flights:', error);
                // Fallback to empty or keep empty
                setScheduleData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFlights();
    }, [date]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const getTimeUntilFlight = (flightTime) => {
        const [hours, minutes] = flightTime.split(':').map(Number);
        const flightDate = new Date();
        flightDate.setHours(hours, minutes, 0);
        const diff = flightDate - currentTime;
        const diffMinutes = Math.floor(diff / 60000);
        return diffMinutes;
    };

    const isDepartingSoon = (flightTime, status) => {
        if (status === 'Departed') return false;
        const minutesUntil = getTimeUntilFlight(flightTime);
        return minutesUntil > 0 && minutesUntil <= 60;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'On Time': return '✓';
            case 'Delayed': return '⚠';
            case 'Departed': return '✈';
            default: return '•';
        }
    };

    const getUniqueDestinations = () => {
        const destinations = [...new Set(scheduleData.map(item => item.dest))];
        return destinations.sort();
    };

    const filteredAndSortedData = () => {
        let filtered = scheduleData.filter(item => {
            const matchesSearch =
                item.flight.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.dest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.airline.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
            const matchesDestination = filterDestination === 'all' || item.dest === filterDestination;
            return matchesSearch && matchesStatus && matchesDestination;
        });

        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'time': comparison = a.time.localeCompare(b.time); break;
                case 'flight': comparison = a.flight.localeCompare(b.flight); break;
                case 'dest': comparison = a.dest.localeCompare(b.dest); break;
                case 'status': comparison = a.status.localeCompare(b.status); break;
                default: comparison = 0;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    };

    const getFlightStats = () => {
        const data = filteredAndSortedData();
        return {
            total: data.length,
            onTime: data.filter(f => f.status === 'On Time').length,
            delayed: data.filter(f => f.status === 'Delayed').length,
            departed: data.filter(f => f.status === 'Departed').length
        };
    };

    const stats = getFlightStats();
    const displayData = filteredAndSortedData();

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) return '⇅';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const exportToCSV = () => {
        const headers = ['Waktu', 'Penerbangan', 'Tujuan', 'Maskapai', 'Gate', 'Terminal', 'Status'];
        const csv = [
            headers.join(','),
            ...displayData.map(row =>
                [row.time, row.flight, row.dest, row.airline, row.gate, row.terminal, row.status].join(',')
            )
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jadwal-keberangkatan-${date}.csv`;
        a.click();
    };

    return (
        <div className={styles.container}>
            <div className={styles.maxWidth}>
                {/* Hero Header */}
                <div className={styles.heroHeader}>
                    <div className={styles.heroContent}>
                        <div className={styles.headerLeft}>
                            <div className={styles.titleWrapper}>
                                <div className={styles.iconBox}>
                                    <span>✈️</span>
                                </div>
                                <h1 className={styles.title}>Jadwal Keberangkatan</h1>
                            </div>
                            <p className={styles.subtitle}>Bandara Internasional Soekarno-Hatta</p>
                        </div>
                        <div className={styles.headerRight}>
                            <div className={styles.liveTimeBox}>
                                <div className={styles.liveTimeContent}>
                                    <div className={styles.pulseWrapper}>
                                        <div className={styles.pulseDot}></div>
                                        <div className={styles.pulseRing}></div>
                                    </div>
                                    <div>
                                        <div className={styles.liveTimeLabel}>Live Time</div>
                                        <div className={styles.liveTime}>{currentTime.toLocaleTimeString('id-ID')}</div>
                                    </div>
                                </div>
                            </div>
                            <input
                                type="date"
                                className={styles.dateInput}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className={styles.statsGrid}>
                    {[
                        { label: 'Total Penerbangan', value: stats.total, icon: '📊', className: styles.statCardBlue },
                        { label: 'Tepat Waktu', value: stats.onTime, icon: '✓', className: styles.statCardGreen },
                        { label: 'Tertunda', value: stats.delayed, icon: '⚠', className: styles.statCardRed },
                        { label: 'Berangkat', value: stats.departed, icon: '✈', className: styles.statCardGray }
                    ].map((stat, i) => (
                        <div key={i} className={`${styles.statCard} ${stat.className}`}>
                            <div className={styles.statCardContent}>
                                <span className={styles.statIcon}>{stat.icon}</span>
                                <div className={styles.statValues}>
                                    <div className={styles.statNumber}>{stat.value}</div>
                                    <div className={styles.statLabel}>{stat.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters & Search */}
                <div className={styles.filtersCard}>
                    <div className={styles.filtersContent}>
                        <div className={styles.searchWrapper}>
                            <input
                                type="text"
                                placeholder="🔍 Cari penerbangan, tujuan, atau maskapai..."
                                className={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className={styles.searchIcon}>🔍</span>
                        </div>
                        <div className={styles.filtersRow}>
                            <select
                                className={styles.select}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">🏷️ Semua Status</option>
                                <option value="On Time">✓ Tepat Waktu</option>
                                <option value="Delayed">⚠ Tertunda</option>
                                <option value="Departed">✈ Berangkat</option>
                            </select>
                            <select
                                className={styles.select}
                                value={filterDestination}
                                onChange={(e) => setFilterDestination(e.target.value)}
                            >
                                <option value="all">🌍 Semua Tujuan</option>
                                {getUniqueDestinations().map(dest => (
                                    <option key={dest} value={dest}>{dest}</option>
                                ))}
                            </select>
                            <button
                                onClick={exportToCSV}
                                className={styles.exportButton}
                            >
                                📥 Export CSV
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className={styles.tableCard}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead className={styles.tableHead}>
                                <tr>
                                    {[
                                        { label: 'Waktu', key: 'time', icon: '🕐' },
                                        { label: 'Penerbangan', key: 'flight', icon: '✈️' },
                                        { label: 'Tujuan', key: 'dest', icon: '🌍' },
                                        { label: 'Maskapai', key: null, icon: '🏢' },
                                        { label: 'Gate', key: null, icon: '🚪' },
                                        { label: 'Terminal', key: null, icon: '🏛️' },
                                        { label: 'Status', key: 'status', icon: '📊' }
                                    ].map((col, i) => (
                                        <th
                                            key={i}
                                            onClick={col.key ? () => toggleSort(col.key) : undefined}
                                            className={`${styles.tableHeadCell} ${col.key ? styles.tableHeadCellSortable : ''}`}
                                        >
                                            <div className={styles.tableHeadContent}>
                                                <span>{col.icon}</span>
                                                <span>{col.label}</span>
                                                {col.key && <span className={styles.sortIcon}>{getSortIcon(col.key)}</span>}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {displayData.length > 0 ? (
                                    displayData.map((item, index) => {
                                        const departingSoon = isDepartingSoon(item.time, item.status);
                                        return (
                                            <tr
                                                key={index}
                                                className={`${styles.tableRow} ${departingSoon ? styles.tableRowSoon : ''} ${index % 2 === 0 ? styles.tableRowEven : ''}`}
                                            >
                                                <td className={styles.tableCell}>
                                                    <div className={styles.timeCell}>
                                                        <span className={styles.timeText}>{item.time}</span>
                                                        {departingSoon && <span className={styles.soonBadge}>SOON</span>}
                                                    </div>
                                                </td>
                                                <td className={styles.tableCell}>
                                                    <span className={styles.flightCode}>{item.flight}</span>
                                                </td>
                                                <td className={styles.tableCell}>
                                                    <span className={styles.destination}>{item.dest}</span>
                                                </td>
                                                <td className={styles.tableCell}>
                                                    <div className={styles.airline}>
                                                        {item.logo && (
                                                            <img
                                                                src={item.logo}
                                                                alt={item.airline}
                                                                className={styles.airlineLogo}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                        )}
                                                        <span>{item.airline}</span>
                                                    </div>
                                                </td>
                                                <td className={styles.tableCell}>
                                                    <span className={styles.gate}>{item.gate}</span>
                                                </td>
                                                <td className={styles.tableCell}>
                                                    <span className={styles.terminal}>{item.terminal}</span>
                                                </td>
                                                <td className={styles.tableCell}>
                                                    <span className={`${styles.statusBadge} ${item.status === 'On Time' ? styles.statusOnTime :
                                                        item.status === 'Delayed' ? styles.statusDelayed :
                                                            styles.statusDeparted
                                                        }`}>
                                                        <span className={styles.statusIcon}>{getStatusIcon(item.status)}</span>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className={styles.emptyState}>
                                            <div className={styles.emptyStateContent}>
                                                <span className={styles.emptyStateIcon}>🔍</span>
                                                <p className={styles.emptyStateTitle}>Tidak ada penerbangan yang sesuai</p>
                                                <p className={styles.emptyStateText}>Coba ubah filter atau kata kunci pencarian</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className={styles.tableFooter}>
                        <div className={styles.footerContent}>
                            <div className={styles.lastUpdate}>
                                <span className={styles.updateDot}></span>
                                <span className={styles.updateLabel}>Terakhir diperbarui:</span>
                                <span className={styles.updateTime}>{currentTime.toLocaleTimeString('id-ID')}</span>
                            </div>
                            <div className={styles.flightCount}>
                                Menampilkan <span className={styles.countCurrent}>{displayData.length}</span> dari <span className={styles.countTotal}>{scheduleData.length}</span> penerbangan
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}