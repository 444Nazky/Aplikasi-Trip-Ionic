import React, { useState } from 'react';
import { Home, List, User } from 'lucide-react';

interface Trip {
  id: string;
  noTrip: string;
  rute?: string;
  status?: string;
  isSynced?: boolean;
  vehicles: { tarif: number }[];
  createdAt: string;
}

interface HomePageProps {
  userName?: string;
  region?: string;
  isOnline?: boolean;
  tripCount?: number;
  vehicleCount?: number;
  recentTrips?: Trip[];
  onLogout?: () => void;
  onNavigate?: (path: string) => void;
}

const demoTrips: Trip[] = [
  { id: '1', noTrip: 'TRP-2026-001', rute: 'SJRE -> BADAU', status: 'completed', isSynced: true, vehicles: [{ tarif: 250000 }], createdAt: new Date().toISOString() },
  { id: '2', noTrip: 'TRP-2026-002', rute: 'BADAU -> SBDZ', status: 'in-progress', isSynced: false, vehicles: [{ tarif: 0 }], createdAt: new Date(Date.now() - 3600000).toISOString() },
];

const HomeScreen: React.FC<HomePageProps> = ({ userName = 'Budi Santoso', region = 'BADAU', tripCount = 3, vehicleCount = 5, onNavigate }) => {
  const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase();

  return (
    <div className="content">
      {/* Profile Card - Dark */}
      <div className="card card-dark">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="avatar avatar-lg" style={{ background: '#1e293b' }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600 }}>{userName}</h2>
            <div className="badge badge-region" style={{ marginTop: 6 }}>
              Region Locked: {region}
            </div>
          </div>
          <button className="btn btn-outline" style={{ padding: '8px 12px', fontSize: 12 }}>Ganti</button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="card card-blue" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Mulai Trip Baru Sekarang</h2>
        <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>Pastikan muatan & dokumen lengkap</p>
        <button className="btn" style={{ background: 'white', color: '#2563eb', width: '100%' }} onClick={() => onNavigate?.('/create-trip')}>
          <span>🚀</span> Mulai Trip
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{tripCount}</div>
          <div className="stat-label">Trip Hari Ini</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{vehicleCount}</div>
          <div className="stat-label">Kendaraan</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">730rb</div>
          <div className="stat-label">Pendapatan</div>
        </div>
      </div>

      {/* Trip Terbaru */}
      <div className="section-header">
        <span className="section-title">Trip Terbaru</span>
        <span className="section-link" onClick={() => onNavigate?.('/history')}>Lihat Semua</span>
      </div>

      {demoTrips.map(trip => (
        <div key={trip.id} className="trip-card" onClick={() => onNavigate?.(`/trip/${trip.id}`)}>
          <div className="trip-info">
            <div className="trip-id">{trip.noTrip}</div>
            <div className="trip-route">{trip.rute || 'Rute tidak tersedia'}</div>
          </div>
          <span className={`trip-status ${trip.isSynced ? 'status-success' : 'status-pending'}`}>
            {trip.isSynced ? '✓ Selesai' : '• Proses'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default HomeScreen;
