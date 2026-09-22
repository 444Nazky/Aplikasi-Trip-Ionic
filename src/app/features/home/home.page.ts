import React, { useState } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon,
  IonButton,
  IonCard,
  IonCardContent,
  IonBadge,
} from '@ionic/react';
import { globeOutline, swapHorizontalOutline, addOutline, chevronForward, carOutline, cubeOutline, cloudOfflineOutline, arrowForward, documentTextOutline } from 'ionicons/icons';

interface Trip {
  id: string;
  noTrip: string;
  rute?: string;
  status?: string;
  isSynced?: boolean;
  statusMuatan?: string;
  vehicles: { noPolisi?: string }[];
  createdAt: string;
}

interface HomePageProps {
  userName?: string;
  regionName?: string;
  isOnline?: boolean;
  tripCount?: number;
  vehicleCount?: number;
  recentTrips?: Trip[];
  onGantiPetugas?: () => void;
  onStartTrip?: () => void;
  onViewTrip?: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  userName = 'Budi Santoso',
  regionName = 'BADAU',
  isOnline = true,
  tripCount = 0,
  vehicleCount = 0,
  recentTrips = [],
  onGantiPetugas,
  onStartTrip,
  onViewTrip,
}) => {
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dd = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mm = months[date.getMonth()];
    const HH = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${dd} ${mm}, ${HH}:${min}`;
  };

  const getRouteParts = (rute?: string) => {
    if (!rute) return { origin: 'BADAU', dest: 'PONTIANAK' };
    const parts = rute.split('→');
    return { origin: (parts[0] || 'BADAU').toUpperCase(), dest: (parts[1] || 'PONTIANAK').toUpperCase() };
  };

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar className="home-toolbar">
          <div className="user-header-row">
            <div className="avatar-info-wrap">
              <div className="driver-avatar"><span>{getInitials(userName)}</span></div>
              <div className="driver-meta">
                <span className="greeting-sub">Selamat Bertugas,</span>
                <h2 className="driver-name">{userName}</h2>
              </div>
            </div>
            <IonBadge className="region-locked-pill">
              <IonIcon icon={globeOutline} />
              <span>Region: {regionName}</span>
            </IonBadge>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="home-content-body">
        {!isOnline && (
          <div className="offline-banner">
            <IonIcon icon={cloudOfflineOutline} />
            <span>Mode Offline — Data tersimpan lokal & akan disinkronkan</span>
          </div>
        )}

        <div className="home-container">
          <IonCard className="hero-navy-card">
            <IonCardContent className="hero-navy-content">
              <div className="profile-top-row">
                <div className="profile-left-col">
                  <div className="driver-avatar-lg"><span>{getInitials(userName)}</span></div>
                  <div className="driver-info-col">
                    <h1 className="driver-name-lg">{userName}</h1>
                    <div className="region-chip">
                      <span className="online-dot" />
                      <span>{regionName} · Aktif</span>
                    </div>
                  </div>
                </div>
                <button type="button" className="btn-ganti-petugas" onClick={onGantiPetugas}>
                  <IonIcon icon={swapHorizontalOutline} />
                  <span>Ganti Petugas</span>
                </button>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="hero-blue-cta">
            <IonCardContent className="hero-blue-content">
              <div className="cta-text-col">
                <h2 className="cta-title">Mulai Trip Baru Sekarang</h2>
                <p className="cta-desc">Pastikan muatan, dokumen, dan kendaraan sudah lengkap sebelum memulai perjalanan.</p>
              </div>
              <IonButton expand="block" className="btn-start-trip" onClick={onStartTrip}>
                <IonIcon icon={addOutline} slot="start" />
                <span>Mulai Trip</span>
              </IonButton>
            </IonCardContent>
          </IonCard>

          <div className="metrics-grid">
            <IonCard className="metric-card">
              <IonCardContent className="metric-card-content">
                <span className="metric-number">{tripCount}</span>
                <span className="metric-label">Trip Hari Ini</span>
              </IonCardContent>
            </IonCard>
            <IonCard className="metric-card">
              <IonCardContent className="metric-card-content">
                <span className="metric-number">{vehicleCount}</span>
                <span className="metric-label">Kendaraan</span>
              </IonCardContent>
            </IonCard>
            <IonCard className="metric-card">
              <IonCardContent className="metric-card-content">
                <div className="sync-indicator-row">
                  <span className={`sync-dot ${isOnline ? 'online' : ''}`} />
                  <span className="metric-number sync-text">{isOnline ? 'Online' : 'Offline'}</span>
                </div>
                <span className="metric-label">Status Sync</span>
              </IonCardContent>
            </IonCard>
          </div>

          <div className="section-title-row">
            <h3 className="section-heading">Trip Terbaru</h3>
            <a className="link-see-all"><span>Lihat Semua</span><IonIcon icon={chevronForward} /></a>
          </div>

          {recentTrips.length > 0 && (
            <div className="trips-card-list">
              {recentTrips.map((trip) => {
                const { origin, dest } = getRouteParts(trip.rute);
                const isCompleted = trip.status === 'completed' || trip.isSynced;
                return (
                  <IonCard key={trip.id} className="trip-entry-card" onClick={() => onViewTrip?.(trip.id)}>
                    <IonCardContent className="trip-entry-content">
                      <div className="trip-card-header">
                        <span className="trip-id-text">{trip.noTrip}</span>
                        <IonBadge className={`trip-status-badge ${isCompleted ? 'completed' : 'in-progress'}`}>
                          {isCompleted ? 'Selesai' : 'Dalam Perjalanan'}
                        </IonBadge>
                      </div>
                      <div className="trip-route-row">
                        <span className="route-origin">{origin}</span>
                        <IonIcon icon={arrowForward} className="route-arrow" />
                        <span className="route-dest">{dest}</span>
                      </div>
                      <div className="card-divider" />
                      <div className="trip-card-footer">
                        <div className="meta-item"><IonIcon icon={carOutline} /><span>{trip.vehicles[0]?.noPolisi || 'KB 9831 DA'}</span></div>
                        <div className="meta-item"><IonIcon icon={cubeOutline} /><span>{trip.statusMuatan}</span></div>
                        <div className="meta-item time"><span>{formatDate(trip.createdAt)}</span></div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                );
              })}
            </div>
          )}

          {recentTrips.length === 0 && (
            <IonCard className="empty-state-card">
              <IonCardContent className="empty-state-content">
                <div className="empty-icon-wrap"><IonIcon icon={documentTextOutline} /></div>
                <h4 className="empty-title">Belum ada trip hari ini</h4>
                <p className="empty-desc">Tekan tombol Mulai Trip di atas untuk mencatat logistik.</p>
              </IonCardContent>
            </IonCard>
          )}
        </div>
      </IonContent>
    </>
  );
};
