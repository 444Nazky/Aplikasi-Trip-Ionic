import React, { useState } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonSpinner,
  IonIcon,
  IonCard,
  IonBadge,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import {
  carOutline,
  walletOutline,
  businessOutline,
  carSportOutline,
  bicycleOutline,
  cube,
  cubeOutline,
  navigateCircle,
  cameraOutline,
  checkmarkCircle,
  timeOutline,
} from 'ionicons/icons';

type Golongan = 'Eksternal' | 'Internal';
type JenisKendaraan = 'Truk' | 'Mobil' | 'Motor';
type StatusMuatanVehicle = 'Dengan Muatan' | 'Tanpa Muatan';

export const InputVehiclePage: React.FC = () => {
  const navigate = useNavigate();
  const [noPolisi, setNoPolisi] = useState('');
  const [golongan, setGolongan] = useState<Golongan>('Eksternal');
  const [jenis, setJenis] = useState<JenisKendaraan>('Truk');
  const [muatan, setMuatan] = useState<StatusMuatanVehicle>('Dengan Muatan');
  const [fotoPath, setFotoPath] = useState('');
  const [gpsText, setGpsText] = useState('');
  const [saving, setSaving] = useState(false);
  const vehicleCount = 1;
  const noTrip = 'TRIP-2026';

  const vehicleTypes = [
    { value: 'Truk' as JenisKendaraan, label: 'Truk', icon: carSportOutline },
    { value: 'Mobil' as JenisKendaraan, label: 'Mobil', icon: carOutline },
    { value: 'Motor' as JenisKendaraan, label: 'Motor', icon: bicycleOutline },
  ];

  const isValid = !!noPolisi && !!fotoPath && !!gpsText;

  const handleCapturePhoto = async () => {
    // TODO: Implement camera + GPS
    setFotoPath('demo-vehicle.jpg');
    setGpsText('-0.02731, 109.3425');
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setSaving(true);
    // TODO: Save vehicle data
    setSaving(false);
    navigate('/success/123');
  };

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar className="form-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/create-trip" className="btn-custom-back" />
          </IonButtons>
          <IonTitle className="form-title">Input Kendaraan</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="form-content-body">
        <div className="form-container">
          <div className="trip-counter-banner">
            <div className="trip-code-wrap">
              <span className="trip-code-label">KODE TRIP AKTIF</span>
              <h2 className="trip-code-val">{noTrip}</h2>
            </div>
            <IonBadge className="vehicle-pill-badge">Kendaraan #{vehicleCount}</IonBadge>
          </div>

          <div className="field-card-group">
            <label className="field-label-text">Nomor Polisi (Plat Kendaraan)</label>
            <IonCard className="white-input-card">
              <div className="plate-prefix-icon"><IonIcon icon={carOutline} /></div>
              <IonInput
                value={noPolisi}
                onIonInput={(e) => setNoPolisi(e.detail.value || '')}
                placeholder="Contoh: KB 9831 DA"
                maxlength={20}
                className="custom-plate-input"
              />
            </IonCard>
          </div>

          <div className="field-card-group">
            <label className="field-label-text">Kategori Armada</label>
            <div className="segment-pill-grid col-2">
              <div
                className={`segment-pill-btn ${golongan === 'Eksternal' ? 'active' : ''}`}
                onClick={() => setGolongan('Eksternal')}
              >
                <IonIcon icon={walletOutline} /><span>Eksternal (Tarif)</span>
              </div>
              <div
                className={`segment-pill-btn ${golongan === 'Internal' ? 'active' : ''}`}
                onClick={() => setGolongan('Internal')}
              >
                <IonIcon icon={businessOutline} /><span>Internal (Perusahaan)</span>
              </div>
            </div>
          </div>

          <div className="field-card-group">
            <label className="field-label-text">Jenis Angkutan</label>
            <div className="segment-pill-grid col-3">
              {vehicleTypes.map((t) => (
                <div
                  key={t.value}
                  className={`segment-pill-btn ${jenis === t.value ? 'active' : ''}`}
                  onClick={() => setJenis(t.value)}
                >
                  <IonIcon icon={t.icon} /><span>{t.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="field-card-group">
            <label className="field-label-text">Status Muatan Kendaraan</label>
            <div className="segment-pill-grid col-2">
              <div
                className={`segment-pill-btn ${muatan === 'Dengan Muatan' ? 'active' : ''}`}
                onClick={() => setMuatan('Dengan Muatan')}
              >
                <IonIcon icon={cube} /><span>Dengan Muatan</span>
              </div>
              <div
                className={`segment-pill-btn ${muatan === 'Tanpa Muatan' ? 'active' : ''}`}
                onClick={() => setMuatan('Tanpa Muatan')}
              >
                <IonIcon icon={cubeOutline} /><span>Tanpa Muatan</span>
              </div>
            </div>
          </div>

          <div className="field-card-group">
            <label className="field-label-text">Lokasi GPS Koordinat</label>
            <div className="gps-soft-box">
              <div className="gps-icon-circle"><IonIcon icon={navigateCircle} /></div>
              <div className="gps-info-text">
                <span className="gps-title-text">GPS Terdeteksi Otomatis</span>
                <span className="gps-coord-text">
                  {gpsText ? `Koordinat: ${gpsText}` : 'Ambil foto di bawah untuk mencatat koordinat GPS'}
                </span>
              </div>
              <div className={`gps-status-indicator ${gpsText ? 'locked' : ''}`}>
                <IonIcon icon={gpsText ? checkmarkCircle : timeOutline} />
              </div>
            </div>
          </div>

          <div className="field-card-group">
            <label className="field-label-text">Dokumentasi Foto Armada & Selfie</label>
            <div className="dashed-camera-box" onClick={handleCapturePhoto}>
              {!fotoPath ? (
                <div className="camera-empty-state">
                  <div className="camera-icon-circle"><IonIcon icon={cameraOutline} /></div>
                  <span className="camera-main-prompt">Ambil Foto Muatan / Selfie</span>
                  <span className="camera-sub-prompt">Tekan untuk membuka kamera & merekam lokasi GPS</span>
                </div>
              ) : (
                <div className="camera-preview-state">
                  <img src={fotoPath} className="photo-preview-image" alt="Foto Armada" />
                  <div className="photo-success-overlay">
                    <IonIcon icon={checkmarkCircle} />
                    <span>Foto & Koordinat GPS Tercatat</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bottom-action-wrap">
            <IonButton
              expand="block"
              disabled={!isValid || saving}
              onClick={handleSubmit}
              className="btn-submit-action"
            >
              {saving ? (
                <IonSpinner name="crescent" className="btn-spinner" />
              ) : (
                <>
                  <span>Simpan Data Kendaraan</span>
                  <IonIcon icon={checkmarkCircle} slot="end" />
                </>
              )}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </>
  );
};

export default InputVehiclePage;
