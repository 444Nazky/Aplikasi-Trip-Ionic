import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButton,
} from '@ionic/react';
import { checkmark, cloudUploadOutline, arrowForward } from 'ionicons/icons';

interface Vehicle {
  id: string;
  noPolisi: string;
  tarif: number;
}

interface Trip {
  id: string;
  noTrip: string;
  vehicles: Vehicle[];
  isSynced?: boolean;
}

interface SuccessDialogPageProps {
  trip?: Trip | null;
  onDone?: () => void;
}

export const SuccessDialogPage: React.FC<SuccessDialogPageProps> = ({ trip, onDone }) => {
  const total = trip?.vehicles.reduce((s, v) => s + (v.tarif || 0), 0) ?? 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  };

  if (!trip) {
    return <IonContent><div className="success-page"><p>Loading...</p></div></IonContent>;
  }

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar><IonTitle>Trip Selesai</IonTitle></IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="success-page">
          <div className="success-hero">
            <div className="success-ring">
              <div className="success-circle"><IonIcon icon={checkmark} /></div>
            </div>
          </div>

          <h2 className="success-title">Trip Berhasil Diselesaikan</h2>
          <p className="success-sub">Data tersimpan dan siap disinkronkan</p>

          <div className="summary-card">
            <div className="summary-row">
              <span className="summary-label">No. Trip</span>
              <span className="summary-value">{trip.noTrip}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row">
              <span className="summary-label">Kendaraan</span>
              <span className="summary-value">{trip.vehicles.length} unit</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total-row">
              <span className="summary-label">Total Tarif</span>
              <span className="summary-value total">{formatCurrency(total)}</span>
            </div>
          </div>

          {!trip.isSynced && (
            <div className="sync-note">
              <IonIcon icon={cloudUploadOutline} />
              <span>Data akan disinkronkan saat online.</span>
            </div>
          )}

          <div className="success-actions">
            <IonButton expand="block" onClick={onDone} className="done-btn">
              Selesai
              <IonIcon icon={arrowForward} slot="end" />
            </IonButton>
          </div>
        </div>
      </IonContent>
    </>
  );
};
