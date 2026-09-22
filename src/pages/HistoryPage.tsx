import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonNote, IonIcon } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { checkmarkCircle, documentTextOutline } from 'ionicons/icons';

interface Trip { id: string; noTrip: string; rute?: string; vehicleCount: number; time: string; isSynced?: boolean; }

export const HistoryPage: React.FC<{ trips?: Trip[] }> = ({ trips = [] }) => {
  const navigate = useNavigate();
  return (
    <IonPage>
      <IonHeader className="ion-no-border"><IonToolbar><IonTitle>Riwayat Trip</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        {trips.length > 0 ? (
          <IonList>
            {trips.map((trip) => (
              <IonItem key={trip.id} button onClick={() => navigate(`/trip-detail/${trip.id}`)} lines="none">
                <IonLabel>
                  <h3>{trip.noTrip}</h3>
                  <p>{trip.rute || '-'} - {trip.vehicleCount} kendaraan</p>
                  <p className="time">{trip.time}</p>
                </IonLabel>
                <IonNote slot="end" color="success"><IonIcon icon={checkmarkCircle} /> Synced</IonNote>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <div className="empty"><IonIcon icon={documentTextOutline} /><p>Belum ada trip</p></div>
        )}
      </IonContent>
    </IonPage>
  );
};
