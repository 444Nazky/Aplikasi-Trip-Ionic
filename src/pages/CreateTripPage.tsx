import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonInput, IonButton, IonSpinner, IonIcon, IonCard, IonBadge } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { cube, cubeOutline, cameraOutline, arrowForward, checkmarkCircle } from 'ionicons/icons';

type StatusMuatan = 'Ada Muatan' | 'Kosong';

export const CreateTripPage: React.FC = () => {
  const navigate = useNavigate();
  const [statusMuatan, setStatusMuatan] = useState<StatusMuatan>('Ada Muatan');
  const [keterangan, setKeterangan] = useState('');
  const [foto, setFoto] = useState('');
  const [saving, setSaving] = useState(false);

  const canSubmit = statusMuatan === 'Ada Muatan' || (!!keterangan && !!foto);

  return (
    <>
      <IonHeader className="ion-no-border"><IonToolbar className="form-toolbar"><IonButtons slot="start"><IonBackButton defaultHref="/tabs/home" className="btn-custom-back" /></IonButtons><IonTitle className="form-title">Buat Trip Baru</IonTitle></IonToolbar></IonHeader>
      <IonContent className="form-content-body">
        <div className="form-container">
          <div className="stepper-bar"><div className="step-item active"><div className="step-circle">1</div><span className="step-label">Status Muatan</span></div><div className="step-line active" /><div className="step-item"><div className="step-circle">2</div><span className="step-label">Input Armada</span></div></div>
          <div className="form-card-group">
            <h3 className="section-label">Kondisi Muatan Awal</h3>
            <div className="muatan-grid">
              <div className={`muatan-card-btn ${statusMuatan === 'Ada Muatan' ? 'active' : ''}`} onClick={() => setStatusMuatan('Ada Muatan')}>
                <div className="muatan-icon-circle loaded"><IonIcon icon={cube} /></div><div className="muatan-info"><span className="muatan-name">Ada Muatan</span><span className="muatan-desc">Membawa kelapa sawit</span></div>
                <div className="selection-indicator">{statusMuatan === 'Ada Muatan' && <div className="indicator-dot" />}</div>
              </div>
              <div className={`muatan-card-btn ${statusMuatan === 'Kosong' ? 'active' : ''}`} onClick={() => setStatusMuatan('Kosong')}>
                <div className="muatan-icon-circle empty"><IonIcon icon={cubeOutline} /></div><div className="muatan-info"><span className="muatan-name">Kosong</span><span className="muatan-desc">Tanpa muatan</span></div>
                <div className="selection-indicator">{statusMuatan === 'Kosong' && <div className="indicator-dot" />}</div>
              </div>
            </div>
          </div>
          {statusMuatan === 'Kosong' && (
            <div className="empty-detail-group">
              <div className="field-title-row"><label className="field-label">Keterangan</label><IonBadge color="danger" className="required-badge">Wajib</IonBadge></div>
              <IonCard className="input-container-card"><IonInput value={keterangan} onIonInput={(e) => setKeterangan(e.detail.value || '')} placeholder="Contoh: Menuju pabrik..." className="styled-text-input" /></IonCard>
              <div className="dashed-camera-box" onClick={() => setFoto('demo.jpg')}>
                {!foto ? (
                  <div className="camera-empty-state"><div className="camera-icon-circle"><IonIcon icon={cameraOutline} /></div><span className="camera-main-prompt">Ambil Foto Kondisi</span></div>
                ) : (
                  <div className="camera-preview-state"><img src={foto} className="photo-preview-image" alt="Foto" /><div className="photo-success-overlay"><IonIcon icon={checkmarkCircle} /><span>Foto Berhasil</span></div></div>
                )}
              </div>
            </div>
          )}
          <div className="bottom-action-wrap">
            <IonButton expand="block" disabled={!canSubmit || saving} onClick={() => navigate('/input-vehicle')} className="btn-submit-action">
              {saving ? <IonSpinner name="crescent" /> : <><span>Lanjut ke Input Kendaraan</span><IonIcon icon={arrowForward} slot="end" /></>}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </>
  );
};
