import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonCard,
  IonCardContent,
  IonButton,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import {
  mapOutline,
  gitNetworkOutline,
  shieldCheckmarkOutline,
  settingsOutline,
  logOutOutline,
  chevronForward,
} from 'ionicons/icons';

interface ProfilePageProps {
  userName?: string;
  regionName?: string;
  userId?: string;
  totalTrips?: number;
  pendingSync?: number;
  rating?: string;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userName = 'Budi Santoso',
  regionName = 'BADAU',
  userId = 'OFF-001',
  totalTrips = 0,
  pendingSync = 0,
  rating = '4.8',
}) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('');
  };

  const handleLogout = () => {
    if (window.confirm('Yakin ingin keluar?')) {
      navigate('/login');
    }
  };

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar className="profile-toolbar">
          <IonTitle className="profile-title">Profil Saya</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="profile-content-body">
        <div className="profile-container">
          <IonCard className="hero-profile-card">
            <IonCardContent className="hero-profile-content">
              <div className="hero-profile-row">
                <div className="hero-avatar"><span>{getInitials(userName)}</span></div>
                <div className="hero-profile-info">
                  <h2 className="hero-profile-name">{userName}</h2>
                  <p className="hero-profile-role">Petugas Lapangan · ID: {userId}</p>
                  <div className="hero-region-tag">
                    <span className="online-indicator-dot" />
                    <span>{regionName} · Aktif</span>
                  </div>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          <div className="profile-metrics-grid">
            <IonCard className="pmetric-card">
              <IonCardContent className="pmetric-card-content">
                <span className="pmetric-num">{totalTrips}</span>
                <span className="pmetric-lbl">Total Trip</span>
              </IonCardContent>
            </IonCard>
            <IonCard className="pmetric-card">
              <IonCardContent className="pmetric-card-content">
                <span className={`pmetric-num ${pendingSync > 0 ? 'warning' : ''}`}>{pendingSync}</span>
                <span className="pmetric-lbl">Pending Sync</span>
              </IonCardContent>
            </IonCard>
            <IonCard className="pmetric-card">
              <IonCardContent className="pmetric-card-content">
                <span className="pmetric-num rating-star">{rating} ★</span>
                <span className="pmetric-lbl">Rating</span>
              </IonCardContent>
            </IonCard>
          </div>

          <IonCard className="menu-group-card">
            <IonCardContent className="menu-group-content">
              <div className="menu-item-row" onClick={() => navigate('/tabs/history')}>
                <div className="menu-icon-wrap blue"><IonIcon icon={mapOutline} /></div>
                <div className="menu-text-col">
                  <span className="menu-main-label">Riwayat Trip</span>
                  <span className="menu-sub-label">Waktu teraktual & logistik</span>
                </div>
                <IonIcon icon={chevronForward} className="menu-chevron" />
              </div>
              <div className="menu-divider" />
              <div className="menu-item-row">
                <div className="menu-icon-wrap green"><IonIcon icon={gitNetworkOutline} /></div>
                <div className="menu-text-col">
                  <span className="menu-main-label">Rute Aktif & Checkpoint</span>
                  <span className="menu-sub-label">Jadwal pos pemeriksaan</span>
                </div>
                <IonIcon icon={chevronForward} className="menu-chevron" />
              </div>
              <div className="menu-divider" />
              <div className="menu-item-row">
                <div className="menu-icon-wrap amber"><IonIcon icon={shieldCheckmarkOutline} /></div>
                <div className="menu-text-col">
                  <span className="menu-main-label">Keamanan & PIN</span>
                  <span className="menu-sub-label">Perangkat terotentikasi</span>
                </div>
                <IonIcon icon={chevronForward} className="menu-chevron" />
              </div>
              <div className="menu-divider" />
              <div className="menu-item-row">
                <div className="menu-icon-wrap slate"><IonIcon icon={settingsOutline} /></div>
                <div className="menu-text-col">
                  <span className="menu-main-label">Pengaturan</span>
                  <span className="menu-sub-label">Notifikasi & sinkronisasi</span>
                </div>
                <IonIcon icon={chevronForward} className="menu-chevron" />
              </div>
            </IonCardContent>
          </IonCard>

          <div className="logout-action-wrap">
            <button type="button" className="btn-outline-danger" onClick={handleLogout}>
              <IonIcon icon={logOutOutline} />
              <span>Ganti Petugas / Keluar</span>
            </button>
          </div>

          <p className="app-version-caption">Trip Angkutan · v1.0 Field Edition</p>
        </div>
      </IonContent>
    </>
  );
};

export default ProfilePage;
