import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon,
} from '@ionic/react';
import { checkmarkCircle, documentTextOutline } from 'ionicons/icons';

interface Trip {
  id: string;
  noTrip: string;
  rute?: string;
  vehicleCount: number;
  time: string;
  isSynced?: boolean;
}

interface HistoryPageProps {
  trips?: Trip[];
  onViewTrip?: (id: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ trips = [], onViewTrip }) => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar><IonTitle>Riwayat Trip</IonTitle></IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {trips.length > 0 ? (
          <IonList>
            {trips.map((trip) => (
              <IonItem key={trip.id} button onClick={() => onViewTrip?.(trip.id)} lines="none">
                <IonLabel>
                  <h3>{trip.noTrip}</h3>
                  <p>{trip.rute || '-'} - {trip.vehicleCount} kendaraan</p>
                  <p className="time">{trip.time}</p>
                </IonLabel>
                <IonNote slot="end" color="success">
                  <IonIcon icon={checkmarkCircle} /> Synced
                </IonNote>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <div className="empty">
            <IonIcon icon={documentTextOutline} />
            <p>Belum ada trip</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};
