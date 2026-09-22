import React, { useState } from 'react';
import { IonContent, IonButton, IonSpinner, IonIcon } from '@ionic/react';
import { backspaceOutline, bus, shieldCheckmark } from 'ionicons/icons';

export const LoginPage: React.FC = () => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const pressKey = (key: string) => {
    if (pin.length < 6) {
      const newPin = pin + key;
      setPin(newPin);
      if (newPin.length === 6) handleLogin(newPin);
    }
  };

  const pressBackspace = () => setPin(pin.slice(0, -1));

  const handleLogin = async (pinToLogin: string) => {
    if (pinToLogin.length !== 6) return;
    setLoading(true);
    setError(false);
    setLoading(false);
    setError(true);
    setErrorMessage('Demo mode');
    setPin('');
  };

  return (
    <IonContent fullscreen className="login-ion-content">
      <div className="login-container">
        <div className="hero-section">
          <div className="hero-icon-badge"><IonIcon icon={bus} /></div>
          <h1 className="hero-title">Trip Angkutan</h1>
          <p className="hero-subtitle">Sistem Pencatatan Angkutan Perkebunan</p>
        </div>
        <div className="region-badge-card">
          <div className="region-icon-wrapper"><IonIcon icon={shieldCheckmark} /></div>
          <div className="region-text-group">
            <span className="region-label">Device Region Locked</span>
            <span className="region-value">BADAU</span>
          </div>
        </div>
        <div className="main-card">
          <div className="officer-card">
            <div className="officer-avatar">BS</div>
            <div className="officer-meta">
              <span className="officer-id">ID: usr-001</span>
              <span className="officer-name">Budi Santoso</span>
              <span className="officer-role">Petugas Lapangan</span>
            </div>
          </div>
          <div className="pin-display-wrapper">
            <span className="pin-label">PIN AKSES</span>
            <div className="pin-dots-container">
              {[0,1,2,3,4,5].map((dot) => (
                <div key={dot} className={`pin-dot ${pin.length > dot ? 'filled' : ''} ${error ? 'error' : ''}`} />
              ))}
            </div>
            <p className={`pin-status-text ${error ? 'error-text' : ''}`}>
              {error ? errorMessage || 'PIN tidak valid.' : 'Masukkan 6 digit PIN Anda'}
            </p>
          </div>
          <div className="numpad-grid">
            {[1,2,3,4,5,6,7,8,9].map((num) => (
              <button key={num} type="button" className="numpad-btn" onClick={() => pressKey(String(num))}>{num}</button>
            ))}
            <div className="numpad-placeholder" />
            <button type="button" className="numpad-btn" onClick={() => pressKey('0')}>0</button>
            <button type="button" className="numpad-btn backspace-btn" onClick={pressBackspace}>
              <IonIcon icon={backspaceOutline} />
            </button>
          </div>
          <IonButton expand="block" className="submit-login-btn" disabled={loading || pin.length !== 6} onClick={() => handleLogin(pin)}>
            {loading ? <IonSpinner name="crescent" className="btn-spinner" /> : <span>Masuk</span>}
          </IonButton>
        </div>
        <p className="app-version-footer">Trip Angkutan v1.0</p>
      </div>
    </IonContent>
  );
};
