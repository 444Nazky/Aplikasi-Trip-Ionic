import React, { useState } from 'react';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

/* Pages */
import {
  LoginPage,
  HomePage,
  ProfilePage,
  HistoryPage,
  CreateTripPage,
  InputVehiclePage,
  SuccessDialogPage,
  TripDetailPage,
} from './react/pages';

/* Icons */
import {
  homeOutline,
  home,
  personOutline,
  person,
  timeOutline,
  time,
} from 'ionicons/icons';

/* Demo data for testing */
const demoTrips = [
  {
    id: '1',
    noTrip: 'TRIP-2026-001',
    rute: 'BADAU → PONTIANAK',
    status: 'completed',
    isSynced: true,
    statusMuatan: 'Ada Muatan',
    vehicles: [{ noPolisi: 'KB 9831 DA' }],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    noTrip: 'TRIP-2026-002',
    rute: 'BADAU → SANGGAU',
    status: 'in-progress',
    isSynced: false,
    statusMuatan: 'Ada Muatan',
    vehicles: [{ noPolisi: 'KB 1234 XX' }],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (pin: string) => {
    // Demo login
    console.log('Login with PIN:', pin);
    setIsLoggedIn(true);
    return { success: true };
  };

  return (
    <IonApp>
      <IonReactRouter>
        {!isLoggedIn ? (
          <IonRouterOutlet>
            <Route exact path="/login" render={() => (
              <LoginPage
                onLogin={handleLogin}
                userName="Budi Santoso"
                userId="usr-001"
                regionName="BADAU"
              />
            )} />
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
          </IonRouterOutlet>
        ) : (
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/tabs/home" render={() => (
                <HomePage
                  userName="Budi Santoso"
                  regionName="BADAU"
                  isOnline={true}
                  tripCount={demoTrips.length}
                  vehicleCount={demoTrips.reduce((sum, t) => sum + t.vehicles.length, 0)}
                  recentTrips={demoTrips}
                  onStartTrip={() => window.location.href = '/create-trip'}
                  onViewTrip={(id) => console.log('View trip:', id)}
                />
              )} />

              <Route exact path="/tabs/profile" render={() => (
                <ProfilePage
                  userName="Budi Santoso"
                  regionName="BADAU"
                  userId="OFF-001"
                  totalTrips={42}
                  pendingSync={2}
                  rating="4.8"
                  onLogout={() => setIsLoggedIn(false)}
                />
              )} />

              <Route exact path="/tabs/history" render={() => (
                <HistoryPage
                  trips={demoTrips.map(t => ({
                    ...t,
                    vehicleCount: t.vehicles.length,
                    time: new Date(t.createdAt).toLocaleString('id-ID'),
                  }))}
                  onViewTrip={(id) => console.log('View trip:', id)}
                />
              )} />

              <Route exact path="/create-trip" render={() => (
                <CreateTripPage
                  onSubmit={(data) => {
                    console.log('Create trip:', data);
                    window.location.href = '/input-vehicle';
                  }}
                />
              )} />

              <Route exact path="/input-vehicle" render={() => (
                <InputVehiclePage
                  noTrip="TRIP-2026-003"
                  vehicleCount={1}
                  onSubmit={(data) => {
                    console.log('Submit vehicle:', data);
                    window.location.href = '/success/123';
                  }}
                />
              )} />

              <Route exact path="/success/:id" render={() => (
                <SuccessDialogPage
                  trip={{
                    id: '123',
                    noTrip: 'TRIP-2026-003',
                    vehicles: [
                      { id: 'v1', noPolisi: 'KB 9831 DA', jenisKendaraan: 'Truk', golongan: 'Eksternal', muatan: 'Dengan Muatan', tarif: 150000 },
                    ],
                    isSynced: false,
                  }}
                  onDone={() => window.location.href = '/tabs/home'}
                />
              )} />

              <Route exact path="/trip-detail/:id" render={() => (
                <TripDetailPage
                  trip={{
                    id: '123',
                    noTrip: 'TRIP-2026-003',
                    rute: 'BADAU → PONTIANAK',
                    status: 'completed',
                    isSynced: true,
                    statusMuatan: 'Ada Muatan',
                    vehicles: [
                      { id: 'v1', noPolisi: 'KB 9831 DA', jenisKendaraan: 'Truk', golongan: 'Eksternal', muatan: 'Dengan Muatan', tarif: 150000 },
                      { id: 'v2', noPolisi: 'KB 5678 YY', jenisKendaraan: 'Mobil', golongan: 'Internal', muatan: 'Tanpa Muatan', tarif: 0 },
                    ],
                    createdAt: new Date().toISOString(),
                  }}
                  onDownloadPdf={() => console.log('Download PDF')}
                />
              )} />

              <Route exact path="/">
                <Redirect to="/tabs/home" />
              </Route>
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/tabs/home">
                <IonIcon icon={homeOutline} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="history" href="/tabs/history">
                <IonIcon icon={timeOutline} />
                <IonLabel>Riwayat</IonLabel>
              </IonTabButton>
              <IonTabButton tab="profile" href="/tabs/profile">
                <IonIcon icon={personOutline} />
                <IonLabel>Profil</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
