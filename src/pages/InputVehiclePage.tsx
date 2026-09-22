import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonInput, IonButton, IonSpinner, IonIcon, IonCard, IonBadge } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { carOutline, walletOutline, businessOutline, carSportOutline, bicycleOutline, cube, cubeOutline, navigateCircle, cameraOutline, checkmarkCircle, timeOutline } from 'ionicons/icons';

type Golongan = 'Eksternal' | 'Internal';
type Jenis = 'Truk' | 'Mobil' | 'Motor';
type Muatan = 'Dengan Muatan' | 'Tanpa Muatan';

export const InputVehiclePage: React.FC = () => {
  const navigate = useNavigate();
  const [noPolisi, setNoPolisi] = useState('');
  const [golongan, setGolongan] = useState<Golongan>('Eksternal');
  const [jenis, setJenis] = useState<Jenis>('Truk');
  const [muatan, setMuatan] = useState<Muatan>('Dengan Muatan');
  const [foto, setFoto] = useState('');
  const [gps, setGps] = useState('');
  const [saving, setSaving] = useState(false);

  const vTypes = [
    { v: 'Truk' as Jenis, l: 'Truk', i: carSportOutline },
    { v: 'Mobil' as Jenis, l: 'Mobil', i: carOutline },
    { v: 'Motor' as Jenis, l: 'Motor', i: bicycleOutline },
  ];

  return (
    <>
      <IonHeader className="ion-no-border"><IonToolbar className="form-toolbar"><IonButtons slot="start"><IonBackButton defaultHref="/create-trip" className="btn-custom-back" /></IonButtons><IonTitle className="form-title">Input Kendaraan</IonTitle></IonToolbar></IonHeader>
      <IonContent className="form-content-body">
        <div className="form-container">
          <div className="trip-counter-banner"><div className="trip-code-wrap"><span className="trip-code-label">KODE TRIP AKTIF</span><h2 className="trip-code-val">TRIP-2026</h2></div><IonBadge className="vehicle-pill-badge">Kendaraan #1</IonBadge></div>
          <div className="field-card-group"><label className="field-label-text">Nomor Polisi</label><IonCard className="white-input-card"><div className="plate-prefix-icon"><IonIcon icon={carOutline} /></div><IonInput value={noPolisi} onIonInput={(e) => setNoPolisi(e.detail.value || '')} placeholder="KB 9831 DA" className="custom-plate-input" /></IonCard></div>
          <div className="field-card-group"><label className="field-label-text">Kategori Armada</label><div className="segment-pill-grid col-2">
            <div className={`segment-pill-btn ${golongan === 'Eksternal' ? 'active' : ''}`} onClick={() => setGolongan('Eksternal')}><IonIcon icon={walletOutline} /><span>Eksternal</span></div>
            <div className={`segment-pill-btn ${golongan === 'Internal' ? 'active' : ''}`} onClick={() => setGolongan('Internal')}><IonIcon icon={businessOutline} /><span>Internal</span></div>
          </div></div>
          <div className="field-card-group"><label className="field-label-text">Jenis Angkutan</label><div className="segment-pill-grid col-3">{vTypes.map((t) => <div key={t.v} className={`segment-pill-btn ${jenis === t.v ? 'active' : ''}`} onClick={() => setJenis(t.v)}><IonIcon icon={t.i} /><span>{t.l}</span></div>)}</div></div>
          <div className="field-card-group"><label className="field-label-text">Status Muatan</label><div className="segment-pill-grid col-2">
            <div className={`segment-pill-btn ${muatan === 'Dengan Muatan' ? 'active' : ''}`} onClick={() => setMuatan('Dengan Muatan')}><IonIcon icon={cube} /><span>Dengan Muatan</span></div>
            <div className={`segment-pill-btn ${muatan === 'Tanpa Muatan' ? 'active' : ''}`} onClick={() => setMuatan('Tanpa Muatan')}><IonIcon icon={cubeOutline} /><span>Tanpa Muatan</span></div>
          </div></div>
          <div className="field-card-group"><label className="field-label-text">Lokasi GPS</label><div className="gps-soft-box"><div className="gps-icon-circle"><IonIcon icon={navigateCircle} /></div><div className="gps-info-text"><span className="gps-title-text">GPS Terdeteksi</span><span className="gps-coord-text">{gps ? `Koordinat: ${gps}` : 'Ambil foto untuk koordinat'}</span></div><div className={`gps-status-indicator ${gps ? 'locked' : ''}`}><IonIcon icon={gps ? checkmarkCircle : timeOutline} /></div></div></div>
          <div className="field-card-group"><label className="field-label-text">Dokumentasi Foto</label><div className="dashed-camera-box" onClick={() => { setFoto('demo.jpg'); setGps('-0.02731, 109.3425'); }}>
            {!foto ? <div className="camera-empty-state"><div className="camera-icon-circle"><IonIcon icon={cameraOutline} /></div><span className="camera-main-prompt">Ambil Foto</span></div> : <div className="camera-preview-state"><img src={foto} className="photo-preview-image" alt="Foto" /><div className="photo-success-overlay"><IonIcon icon={checkmarkCircle} /><span>GPS Tercatat</span></div></div>}
          </div></div>
          <div className="bottom-action-wrap"><IonButton expand="block" disabled={!noPolisi || !foto || !gps || saving} onClick={() => navigate('/success/1')} className="btn-submit-action">{saving ? <IonSpinner name="crescent" /> : <><span>Simpan</span><IonIcon icon={checkmarkCircle} slot="end" /></>}</IonButton></div>
        </div>
      </IonContent>
    </>
  );
};
