import React, { useState, useEffect } from 'react';
import { IonContent, IonSpinner, IonIcon, IonButton } from '@ionic/react';
import { backspaceOutline, busOutline, shieldCheckmarkOutline } from 'ionicons/icons';

export const LoginPage: React.FC = () => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!error) return;
    setShake(true);
    const t = setTimeout(() => setShake(false), 450);
    return () => clearTimeout(t);
  }, [error]);

  const pressKey = (key: string) => {
    if (loading || pin.length >= 6) return;
    const newPin = pin + key;
    setPin(newPin);
    setError(false);
    if (newPin.length === 6) handleLogin(newPin);
  };

  const pressBackspace = () => {
    if (loading) return;
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const handleLogin = async (pinToLogin: string) => {
    if (pinToLogin.length !== 6) return;
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      setError(true);
      setErrorMessage('Demo mode — PIN belum terhubung');
      setPin('');
    }, 800);
  };

  return (
    <IonContent fullscreen className="login-ion-content">
      {/* ============ INLINE STYLES ============ */}
      <style>{`
        .login-ion-content {
          --background: #e2e8f0;
        }

        .login-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 20px 32px;
          gap: 14px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background:
            radial-gradient(circle at 20% 0%, #dbeafe 0%, transparent 42%),
            radial-gradient(circle at 100% 100%, #c7d2fe 0%, transparent 45%),
            #e2e8f0;
        }

        /* ============ HERO ============ */
        .hero-section {
          width: 100%;
          max-width: 380px;
        }
        .brand-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .brand-logo {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          color: #fff;
          box-shadow: 0 10px 24px -8px rgba(37,99,235,.6);
        }
        .brand-text { text-align: left; }
        .brand-title {
          margin: 0;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #0f172a;
          line-height: 1.1;
        }
        .brand-subtitle {
          margin: 2px 0 0;
          font-size: 12px;
          font-weight: 500;
          color: #64748b;
        }

        /* ============ REGION CARD ============ */
        .region-card {
          width: 100%;
          max-width: 380px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(15,23,42,.06);
          box-shadow: 0 2px 10px -4px rgba(15,23,42,.08);
        }
        .region-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: rgba(37,99,235,.1);
          color: #2563eb;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .region-text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        .region-label {
          font-size: 10px; font-weight: 600;
          letter-spacing: .08em; text-transform: uppercase;
          color: #94a3b8;
        }
        .region-value {
          font-size: 15px; font-weight: 800;
          letter-spacing: .02em; color: #0f172a;
        }
        .region-status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 4px rgba(34,197,94,.15);
          flex-shrink: 0;
        }

        /* ============ MAIN CARD ============ */
        .main-card {
          width: 100%;
          max-width: 380px;
          background: #fff;
          border-radius: 28px;
          padding: 22px 20px 20px;
          box-shadow:
            0 20px 40px -20px rgba(15,23,42,.25),
            0 2px 6px -2px rgba(15,23,42,.08);
          border: 1px solid rgba(15,23,42,.04);
        }

        /* Officer Card */
        .officer-card {
          display: flex; align-items: center; gap: 12px;
          padding: 12px;
          background: #0f172a;
          border-radius: 18px;
          color: #fff;
        }
        .officer-avatar {
          width: 46px; height: 46px;
          border-radius: 14px;
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 16px; letter-spacing: .02em;
          color: #fff; flex-shrink: 0;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.12);
        }
        .officer-meta {
          display: flex; flex-direction: column;
          flex: 1; min-width: 0;
        }
        .officer-name {
          font-size: 15px; font-weight: 700;
          color: #fff; line-height: 1.2;
        }
        .officer-role {
          font-size: 11px; font-weight: 500;
          color: #94a3b8; margin-top: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .switch-officer-btn {
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.14);
          color: #fff; font-size: 12px; font-weight: 600;
          padding: 7px 12px; border-radius: 10px;
          cursor: pointer; transition: all .15s ease;
          flex-shrink: 0; font-family: inherit;
        }
        .switch-officer-btn:hover { background: rgba(255,255,255,.16); }
        .switch-officer-btn:active { transform: scale(.96); }

        /* Divider */
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e2e8f0, transparent);
          margin: 18px 0 14px;
        }

        /* ============ PIN SECTION ============ */
        .pin-section {
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          margin-bottom: 18px;
        }
        .pin-section.shake {
          animation: shake .4s cubic-bezier(.36,.07,.19,.97);
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
        }
        .pin-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: .14em; text-transform: uppercase;
          color: #94a3b8;
        }
        .pin-dots { display: flex; gap: 12px; margin: 4px 0 2px; }
        .pin-dot {
          width: 14px; height: 14px; border-radius: 50%;
          background: #e2e8f0;
          border: 2px solid #cbd5e1;
          transition: all .18s ease;
        }
        .pin-dot.filled {
          background: #2563eb;
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37,99,235,.15);
          transform: scale(1.05);
        }
        .pin-dot.error {
          background: #ef4444;
          border-color: #ef4444;
          box-shadow: 0 0 0 4px rgba(239,68,68,.15);
        }
        .pin-status {
          margin: 0; font-size: 12px; font-weight: 500;
          color: #64748b; text-align: center;
          min-height: 16px; transition: color .15s ease;
        }
        .pin-status.is-error { color: #ef4444; font-weight: 600; }

        /* ============ NUMPAD ============ */
        .numpad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 18px;
        }
        .numpad-key {
          height: 56px;
          border-radius: 16px;
          border: none;
          background: #f1f5f9;
          color: #0f172a;
          font-size: 22px;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all .12s ease;
          -webkit-tap-highlight-color: transparent;
          letter-spacing: -0.02em;
        }
        .numpad-key:hover { background: #e2e8f0; }
        .numpad-key:active {
          background: #dbeafe;
          color: #2563eb;
          transform: scale(.96);
        }
        .numpad-key--ghost {
          background: transparent;
          pointer-events: none;
        }
        .numpad-key--action {
          background: transparent;
          color: #64748b;
          font-size: 22px;
        }
        .numpad-key--action:hover {
          background: #fee2e2;
          color: #ef4444;
        }
        .numpad-key--action:active {
          background: #fecaca;
          color: #dc2626;
          transform: scale(.96);
        }

        /* ============ SUBMIT BUTTON ============ */
        .submit-btn {
          --background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          --background-hover: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
          --background-activated: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          --border-radius: 16px;
          --box-shadow: 0 10px 24px -10px rgba(37,99,235,.7);
          --color: #fff;
          --padding-top: 14px;
          --padding-bottom: 14px;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: .01em;
          text-transform: none;
          height: 54px;
          margin: 0;
        }
        .submit-btn[disabled] {
          --background: #e2e8f0;
          --color: #94a3b8;
          --box-shadow: none;
          opacity: 1;
        }
        .btn-spinner {
          width: 22px; height: 22px;
          color: #fff;
        }

        /* ============ FOOTER ============ */
        .demo-hint {
          display: flex; align-items: center; justify-content: center;
          gap: 6px; margin: 14px 0 0;
          font-size: 11px; font-weight: 500;
          color: #94a3b8;
        }
        .demo-hint b {
          color: #2563eb; font-weight: 800;
          letter-spacing: .04em;
        }
        .demo-hint-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 3px rgba(34,197,94,.15);
        }
        .app-footer {
          margin: 8px 0 0;
          font-size: 11px; font-weight: 500;
          color: #94a3b8; letter-spacing: .02em;
        }

        /* ============ SMALL SCREENS ============ */
        @media (max-height: 720px) {
          .login-screen { padding: 16px 16px 20px; gap: 10px; }
          .brand-logo { width: 46px; height: 46px; font-size: 22px; }
          .brand-title { font-size: 19px; }
          .main-card { padding: 18px 16px 16px; border-radius: 24px; }
          .numpad-key { height: 48px; font-size: 20px; }
          .submit-btn { height: 50px; }
          .divider { margin: 14px 0 12px; }
        }
      `}</style>

      <div className="login-screen">
        {/* ============ HERO ============ */}
        <div className="hero-section">
          <div className="brand-row">
            <div className="brand-logo">
              <IonIcon icon={busOutline} />
            </div>
            <div className="brand-text">
              <h1 className="brand-title">Trip Angkutan</h1>
              <p className="brand-subtitle">Pencatatan Angkutan Perkebunan</p>
            </div>
          </div>
        </div>

        {/* ============ REGION LOCK CARD ============ */}
        <div className="region-card">
          <div className="region-icon">
            <IonIcon icon={shieldCheckmarkOutline} />
          </div>
          <div className="region-text">
            <span className="region-label">Device Region Locked</span>
            <span className="region-value">BADAU</span>
          </div>
          <span className="region-status-dot" />
        </div>

        {/* ============ MAIN CARD ============ */}
        <div className="main-card">
          {/* Officer Info */}
          <div className="officer-card">
            <div className="officer-avatar">BS</div>
            <div className="officer-meta">
              <span className="officer-name">Budi Santoso</span>
              <span className="officer-role">Petugas Lapangan · ID: usr-001</span>
            </div>
            <button className="switch-officer-btn" type="button">
              Ganti
            </button>
          </div>

          <div className="divider" />

          {/* PIN Display */}
          <div className={`pin-section ${shake ? 'shake' : ''}`}>
            <span className="pin-label">PIN AKSES</span>
            <div className="pin-dots">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`pin-dot ${pin.length > i ? 'filled' : ''} ${
                    error ? 'error' : ''
                  }`}
                />
              ))}
            </div>
            <p className={`pin-status ${error ? 'is-error' : ''}`}>
              {error
                ? errorMessage || 'PIN tidak valid, coba lagi'
                : 'Masukkan 6 digit PIN Anda'}
            </p>
          </div>

          {/* Numpad */}
          <div className="numpad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                type="button"
                className="numpad-key"
                onClick={() => pressKey(String(n))}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              className="numpad-key numpad-key--ghost"
              disabled
            />
            <button
              type="button"
              className="numpad-key"
              onClick={() => pressKey('0')}
            >
              0
            </button>
            <button
              type="button"
              className="numpad-key numpad-key--action"
              onClick={pressBackspace}
              aria-label="Hapus"
            >
              <IonIcon icon={backspaceOutline} />
            </button>
          </div>

          {/* Submit */}
          <IonButton
            expand="block"
            className="submit-btn"
            disabled={loading || pin.length !== 6}
            onClick={() => handleLogin(pin)}
          >
            {loading ? (
              <IonSpinner name="crescent" className="btn-spinner" />
            ) : (
              <span>Konfirmasi &amp; Masuk</span>
            )}
          </IonButton>

          <p className="demo-hint">
            <span className="demo-hint-dot" /> Demo PIN: <b>123456</b>
          </p>
        </div>

        <p className="app-footer">Trip Angkutan v1.0 · © 2026</p>
      </div>
    </IonContent>
  );
};