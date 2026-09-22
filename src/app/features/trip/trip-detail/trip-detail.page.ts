import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonIcon,
  IonCard,
  IonCardContent,
  IonBadge,
  IonButton,
} from '@ionic/react';
import { checkmark, radioButtonOn, ellipse, createOutline, documentTextOutline } from 'ionicons/icons';

interface Vehicle {
  id: string;
  noPolisi: string;
  jenisKendaraan: string;
  golongan: string;
  muatan: string;
  tarif: number;
}

interface Trip {
  id: string;
  noTrip: string;
  rute?: string;
  status?: string;
  isSynced?: boolean;
  statusMuatan?: string;
  vehicles: Vehicle[];
  createdAt: string;
}

interface TripDetailPageProps {
  trip?: Trip | null;
  onDownloadPdf?: () => void;
}

export const TripDetailPage: React.FC<TripDetailPageProps> = ({ trip, onDownloadPdf }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
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

  if (!trip) {
    return <IonContent><div className="detail-container"><p>Loading...</p></div></IonContent>;
  }

  const totalTarif = trip.vehicles.reduce((s, v) => s + (v.tarif || 0), 0);
  const isCompleted = trip.status === 'completed' || trip.isSynced;

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar className="detail-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" className="btn-custom-back" />
          </IonButtons>
          <IonTitle className="detail-title">Pelacakan & Detail Trip</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="detail-content-body">
        <div className="detail-container">
          <IonCard className="hero-navy-card">
            <IonCardContent className="hero-navy-content">
              <div className="hero-top-meta">
                <span className="hero-trip-id">{trip.noTrip}</span>
                <IonBadge className={`hero-status-pill ${isCompleted ? 'completed' : 'in-progress'}`}>
                  {isCompleted ? 'Selesai' : 'Dalam Perjalanan'}
                </IonBadge>
              </div>
              <h1 className="hero-route-title">{trip.rute || 'BADAU → PONTIANAK'}</h1>
              <div className="hero-metrics-strip">
                <div className="strip-item">
                  <span className="strip-label">Kendaraan</span>
                  <span className="strip-value">{trip.vehicles[0]?.noPolisi || 'Armada 1'}</span>
                </div>
                <div className="strip-item">
                  <span className="strip-label">Muatan</span>
                  <span className="strip-value">{trip.statusMuatan}</span>
                </div>
                <div className="strip-item">
                  <span className="strip-label">Total Tarif</span>
                  <span className="strip-value highlight">{formatCurrency(totalTarif)}</span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="white-section-card">
            <IonCardContent className="white-section-content">
              <h3 className="card-section-title">Rute & Checkpoint Titik Pantau</h3>
              <div className="vertical-stepper">
                <div className="stepper-node completed">
                  <div className="node-marker"><IonIcon icon={checkmark} /></div>
                  <div className="node-line" />
                  <div className="node-info">
                    <div className="node-heading-row">
                      <span className="node-name">Titik Keberangkatan (Badau)</span>
                      <span className="node-time">{formatDate(trip.createdAt)}</span>
                    </div>
                    <p className="node-status-desc">Pemeriksaan armada awal selesai</p>
                  </div>
                </div>
                <div className="stepper-node completed">
                  <div className="node-marker"><IonIcon icon={checkmark} /></div>
                  <div className="node-line" />
                  <div className="node-info">
                    <div className="node-heading-row">
                      <span className="node-name">Pos Pemeriksaan 1 (Simpang)</span>
                      <span className="node-time">Terverifikasi</span>
                    </div>
                    <p className="node-status-desc">Muatan aman, segel utuh</p>
                  </div>
                </div>
                <div className={`stepper-node ${isCompleted ? 'completed' : 'active'}`}>
                  <div className="node-marker"><IonIcon icon={isCompleted ? checkmark : radioButtonOn} /></div>
                  <div className="node-line" />
                  <div className="node-info">
                    <div className="node-heading-row">
                      <span className="node-name">Pos Pemeriksaan 2 (Sanggau)</span>
                      {isCompleted ? <span className="node-time">Selesai</span> : <span className="node-time current-pill">Pos Aktif</span>}
                    </div>
                    <p className="node-status-desc">{isCompleted ? 'Pemeriksaan pos tuntas' : 'Silakan lapor checkpoint sekarang'}</p>
                  </div>
                </div>
                <div className={`stepper-node ${isCompleted ? 'completed' : ''}`}>
                  <div className="node-marker end-point"><IonIcon icon={isCompleted ? checkmark : ellipse} /></div>
                  <div className="node-info">
                    <div className="node-heading-row">
                      <span className="node-name">Titik Tujuan Akhir</span>
                      {isCompleted ? <span className="node-time">Tiba</span> : <span className="node-time pending">Belum dicapai</span>}
                    </div>
                    <p className="node-status-desc">{isCompleted ? 'Bongkar muat & berkas ditandatangani' : 'Tujuan akhir bongkar muatan'}</p>
                  </div>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="white-section-card">
            <IonCardContent className="white-section-content">
              <h3 className="card-section-title">Daftar Kendaraan Terdaftar ({trip.vehicles.length})</h3>
              <div className="vehicles-list-wrap">
                {trip.vehicles.map((v, idx) => (
                  <div key={v.id} className="vehicle-item-row">
                    <div className="vehicle-idx-badge">{idx + 1}</div>
                    <div className="vehicle-detail-col">
                      <span className="vehicle-plate-text">{v.noPolisi}</span>
                      <span className="vehicle-type-text">{v.jenisKendaraan} · {v.golongan}</span>
                    </div>
                    <div className="vehicle-cost-col">
                      <span className="vehicle-cost-amount">{formatCurrency(v.tarif)}</span>
                      <span className={`vehicle-muatan-tag ${v.muatan === 'Tanpa Muatan' ? 'empty-tag' : ''}`}>{v.muatan}</span>
                    </div>
                  </div>
                ))}
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard className="white-section-card">
            <IonCardContent className="white-section-content">
              <h3 className="card-section-title">Konfirmasi & Tanda Tangan Petugas</h3>
              <div className="signature-box-container">
                <div className="signature-sketch-icon"><IonIcon icon={createOutline} /></div>
                <span className="signature-officer-name">Petugas Lapangan Terverifikasi</span>
                <span className="signature-officer-sub">Wilayah Operasional BADAU</span>
              </div>
            </IonCardContent>
          </IonCard>

          <div className="bottom-action-buttons">
            <IonButton expand="block" className="btn-dark-navy-action" onClick={onDownloadPdf}>
              <IonIcon icon={documentTextOutline} slot="start" />
              <span>Unduh Laporan Perjalanan (PDF)</span>
            </IonButton>
          </div>
        </div>
      </IonContent>
    </>
  );
};
