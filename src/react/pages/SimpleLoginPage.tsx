import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonSpinner,
} from '@ionic/react';

export const SimpleLoginPage: React.FC = () => {
  const [pin, setPin] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handlePinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setPin(numericValue);
  };

  const handleLogin = async () => {
    if (pin.length !== 6 || loading) return;
    setLoading(true);
    // TODO: implement login
    setLoading(false);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="login-container">
          <div className="logo-section">
            <h1 className="app-title">TRIP ANGKUTAN</h1>
            <p className="subtitle">Masuk dengan PIN Anda</p>
          </div>

          <div className="pin-container">
            <IonInput
              type="tel"
              inputMode="numeric"
              maxlength={6}
              placeholder="_"
              value={pin}
              onIonInput={(e) => handlePinChange(e.detail.value || '')}
              className="pin-input"
            />
            <div className="pin-dots">
              {[0, 1, 2, 3, 4, 5].map((dot) => (
                <div key={dot} className={`pin-dot ${pin.length > dot ? 'filled' : ''}`} />
              ))}
            </div>
          </div>

          <IonButton
            expand="block"
            onClick={handleLogin}
            disabled={pin.length !== 6 || loading}
            className="login-btn"
          >
            {loading ? <IonSpinner name="crescent" /> : <span>MASUK</span>}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SimpleLoginPage;
