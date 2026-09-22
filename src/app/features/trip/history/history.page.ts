import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonCard,
  IonCardContent,
  IonBadge,
} from '@ionic/react';
import { documentTextOutline, arrowForward, carOutline, cubeOutline, chevronForward } from 'ionicons/icons';

interface Trip {
  id: string;
  noTrip: string;
  rute?: string;
  vehicles: { tarif: number }[];
  statusMuatan?: string;
  isSynced?: boolean;
  total: number;
  createdAt: string;
}

interface TripHistoryPageProps {
  trips?: Trip[];
  onViewDetail?: (trip: Trip) => void;
}

export const TripHistoryPage: React.FC<TripHistoryPageProps> = ({ trips = [], onViewDetail }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dd = date.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mm = months[date.getMonth()];
    const yyyy = date.getFullYear();
    const HH = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');
    return `${dd} ${mm} ${yyyy}, ${HH}:${min}`;
  };

  const getRouteParts = (rute?: string) => {
    if (!rute) return { origin: 'BADAU', dest: 'PONTIANAK' };
    const parts = rute.split('→');
    return {
      origin: (parts[0] || 'BADAU').toUpperCase(),
      dest: (parts[1] || 'PONTIANAK').toUpperCase(),
    };
  };

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar className="history-toolbar">
          <IonTitle className="history-title">Riwayat Trip</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="history-content-body">
        <div className="history-container">
          {trips.length === 0 ? (
            <IonCard className="empty-state-card">
              <IonCardContent className="empty-state-content">
                <div className="empty-icon-wrap">
                  <IonIcon icon={documentTextOutline} />
                </div>
                <h3 className="empty-title">Belum ada trip</h3>
                <p className="empty-desc">Riwayat perjalanan danlogistik Anda akan muncul di sini.</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <div className="trips-list">
              {trips.map((trip) => {
                const { origin, dest } = getRouteParts(trip.rute);
                return (
                  <IonCard
                    key={trip.id}
                    className="history-trip-card"
                    onClick={() => onViewDetail?.(trip)}
                  >
                    <IonCardContent className="history-trip-content">
                      <div className="history-card-top">
                        <span className="trip-id-code">{trip.noTrip}</span>
                        <IonBadge className={`sync-status-badge ${trip.isSynced ? 'synced' : 'pending'}`}>
                          {trip.isSynced ? 'Synced' : 'Pending'}
                        </IonBadge>
                      </div>

                      <div className="trip-route-display">
                        <span className="route-point">{origin}</span>
                        <IonIcon icon={arrowForward} className="route-arrow" />
                        <span className="route-point">{dest}</span>
                      </div>

                      <div className="card-divider" />

                      <div className="history-card-bottom">
                        <div className="meta-tags-row">
                          <span className="meta-tag">
                            <IonIcon icon={carOutline} />
                            {trip.vehicles.length} armada
                          </span>
                          <span className="meta-tag">
                            <IonIcon icon={cubeOutline} />
                            {trip.statusMuatan}
                          </span>
                          <span className="meta-date">{formatDate(trip.createdAt)}</span>
                        </div>
                        <div className="trip-total-price">
                          <span>{formatCurrency(trip.total)}</span>
                          <IonIcon icon={chevronForward} className="arrow-icon" />
                        </div>
                      </div>
                    </IonCardContent>
                  </IonCard>
                );
              })}
            </div>
          )}
        </div>
      </IonContent>
    </>
  );
};
