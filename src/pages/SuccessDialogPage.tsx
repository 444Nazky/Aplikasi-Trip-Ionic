import React from 'react';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonButton } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { checkmark, cloudUploadOutline, arrowForward } from 'ionicons/icons';

export const SuccessDialogPage: React.FC<{ noTrip?: string; vehicleCount?: number; total?: number }> = ({ noTrip = 'TRIP-2026-001', vehicleCount = 1, total = 0 }) => {
  const navigate = useNavigate();
  const fmt = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
  return (
    <>
      <IonHeader className="ion-no-border"><IonToolbar><IonTitle>Trip Selesai</IonTitle></IonToolbar></IonHeader>
      <IonContent>
        <div className="success-page">
          <div className="success-hero"><div className="success-ring"><div className="success-circle"><IonIcon icon={checkmark} /></div></div></div>
          <h2 className="success-title">Trip Berhasil Diselesaikan</h2>
          <p className="success-sub">Data tersimpan dan siap disinkronkan</p>
          <div className="summary-card">
            <div className="summary-row"><span className="summary-label">No. Trip</span><span className="summary-value">{noTrip}</span></div>
            <div className="summary-divider" />
            <div className="summary-row"><span className="summary-label">Kendaraan</span><span className="summary-value">{vehicleCount} unit</span></div>
            <div className="summary-divider" />
            <div className="summary-row total-row"><span className="summary-label">Total Tarif</span><span className="summary-value total">{fmt(total)}</span></div>
          </div>
          <div className="sync-note"><IonIcon icon={cloudUploadOutline} /><span>Data akan disinkronkan saat online.</span></div>
          <div className="success-actions"><IonButton expand="block" onClick={() => navigate('/tabs/home')} className="done-btn">Selesai<IonIcon icon={arrowForward} slot="end" /></IonButton></div>
        </div>
      </IonContent>
    </>
  );
};
