import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonIcon, IonCard, IonCardContent, IonBadge, IonButton } from '@ionic/react';
import { checkmark, radioButtonOn, ellipse, createOutline, documentTextOutline } from 'ionicons/icons';

interface Vehicle { id: string; noPolisi: string; jenis: string; golongan: string; muatan: string; tarif: number; }
interface Trip { id: string; noTrip: string; rute?: string; status?: string; isSynced?: boolean; muatan?: string; vehicles: Vehicle[]; createdAt: string; }

export const TripDetailPage: React.FC<{ trip?: Trip }> = ({ trip }) => {
  const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
  const fDate = (d: string) => { const dt = new Date(d); return `${dt.getDate().toString().padStart(2,'0')} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][dt.getMonth()]}, ${dt.getHours().toString().padStart(2,'0')}:${dt.getMinutes().toString().padStart(2,'0')}`; };
  if (!trip) return <IonContent><div className="detail-container"><p>Loading...</p></div></IonContent>;
  const total = trip.vehicles.reduce((s, v) => s + v.tarif, 0);
  const done = trip.status === 'completed' || trip.isSynced;
  return (
    <>
      <IonHeader className="ion-no-border"><IonToolbar className="detail-toolbar"><IonButtons slot="start"><IonBackButton defaultHref="/tabs/home" className="btn-custom-back" /></IonButtons><IonTitle className="detail-title">Detail Trip</IonTitle></IonToolbar></IonHeader>
      <IonContent className="detail-content-body">
        <div className="detail-container">
          <IonCard className="hero-navy-card">
            <IonCardContent className="hero-navy-content">
              <div className="hero-top-meta"><span className="hero-trip-id">{trip.noTrip}</span><IonBadge className={`hero-status-pill ${done ? 'completed' : 'in-progress'}`}>{done ? 'Selesai' : 'Dalam Perjalanan'}</IonBadge></div>
              <h1 className="hero-route-title">{trip.rute || 'BADAU → PONTIANAK'}</h1>
              <div className="hero-metrics-strip">
                <div className="strip-item"><span className="strip-label">Kendaraan</span><span className="strip-value">{trip.vehicles[0]?.noPolisi || '-'}</span></div>
                <div className="strip-item"><span className="strip-label">Muatan</span><span className="strip-value">{trip.muatan}</span></div>
                <div className="strip-item"><span className="strip-label">Total Tarif</span><span className="strip-value highlight">{fmt(total)}</span></div>
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard className="white-section-card">
            <IonCardContent className="white-section-content">
              <h3 className="card-section-title">Rute & Checkpoint</h3>
              <div className="vertical-stepper">
                <div className="stepper-node completed"><div className="node-marker"><IonIcon icon={checkmark} /></div><div className="node-line" /><div className="node-info"><div className="node-heading-row"><span className="node-name">Titik Keberangkatan (Badau)</span><span className="node-time">{fDate(trip.createdAt)}</span></div><p className="node-status-desc">Pemeriksaan armada awal selesai</p></div></div>
                <div className="stepper-node completed"><div className="node-marker"><IonIcon icon={checkmark} /></div><div className="node-line" /><div className="node-info"><div className="node-heading-row"><span className="node-name">Pos Pemeriksaan 1 (Simpang)</span><span className="node-time">Terverifikasi</span></div><p className="node-status-desc">Muatan aman, segel utuh</p></div></div>
                <div className={`stepper-node ${done ? 'completed' : 'active'}`}><div className="node-marker"><IonIcon icon={done ? checkmark : radioButtonOn} /></div><div className="node-line" /><div className="node-info"><div className="node-heading-row"><span className="node-name">Pos Pemeriksaan 2 (Sanggau)</span>{done ? <span className="node-time">Selesai</span> : <span className="node-time current-pill">Pos Aktif</span>}</div><p className="node-status-desc">{done ? 'Pemeriksaan pos tuntas' : 'Silakan lapor checkpoint'}</p></div></div>
                <div className={`stepper-node ${done ? 'completed' : ''}`}><div className="node-marker end-point"><IonIcon icon={done ? checkmark : ellipse} /></div><div className="node-info"><div className="node-heading-row"><span className="node-name">Titik Tujuan Akhir</span>{done ? <span className="node-time">Tiba</span> : <span className="node-time pending">Belum dicapai</span>}</div></div></div>
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard className="white-section-card">
            <IonCardContent className="white-section-content">
              <h3 className="card-section-title">Kendaraan ({trip.vehicles.length})</h3>
              <div className="vehicles-list-wrap">
                {trip.vehicles.map((v, i) => (
                  <div key={v.id} className="vehicle-item-row">
                    <div className="vehicle-idx-badge">{i + 1}</div>
                    <div className="vehicle-detail-col"><span className="vehicle-plate-text">{v.noPolisi}</span><span className="vehicle-type-text">{v.jenis} · {v.golongan}</span></div>
                    <div className="vehicle-cost-col"><span className="vehicle-cost-amount">{fmt(v.tarif)}</span><span className={`vehicle-muatan-tag ${v.muatan === 'Tanpa Muatan' ? 'empty-tag' : ''}`}>{v.muatan}</span></div>
                  </div>
                ))}
              </div>
            </IonCardContent>
          </IonCard>
          <IonCard className="white-section-card"><IonCardContent className="white-section-content"><h3 className="card-section-title">Konfirmasi & Tanda Tangan</h3><div className="signature-box-container"><div className="signature-sketch-icon"><IonIcon icon={createOutline} /></div><span className="signature-officer-name">Petugas Lapangan Terverifikasi</span><span className="signature-officer-sub">Wilayah BADAU</span></div></IonCardContent></IonCard>
          <div className="bottom-action-buttons"><IonButton expand="block" className="btn-dark-navy-action"><IonIcon icon={documentTextOutline} slot="start" /><span>Unduh Laporan (PDF)</span></IonButton></div>
        </div>
      </IonContent>
    </>
  );
};
