import React, { useState } from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Routes, Route, Navigate } from 'react-router-dom';

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

const demoTrips = [
  {
    id: '1',
    noTrip: 'TRIP-2026-001',
    rute: 'BADAU → PONTIANAK',
    status: 'completed',
    isSynced: true,
    statusMuatan: 'Ada Muatan',
    vehicles: [{ id: 'v1', noPolisi: 'KB 9831 DA', jenisKendaraan: 'Truk', golongan: 'Eksternal', muatan: 'Dengan Muatan', tarif: 150000 }],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    noTrip: 'TRIP-2026-002',
    rute: 'BADAU → SANGGAU',
    status: 'in-progress',
    isSynced: false,
    statusMuatan: 'Ada Muatan',
    vehicles: [{ id: 'v2', noPolisi: 'KB 1234 XX', jenisKendaraan: 'Mobil', golongan: 'Internal', muatan: 'Tanpa Muatan', tarif: 0 }],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (pin: string) => {
    console.log('Login with PIN:', pin);
    setIsLoggedIn(true);
    return { success: true };
  };

  if (!isLoggedIn) {
    return (
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Routes>
            <Route path="/tabs/home" element={
              <HomePage
                userName="Budi Santoso"
                regionName="BADAU"
                isOnline={true}
                tripCount={demoTrips.length}
                vehicleCount={demoTrips.reduce((sum, t) => sum + t.vehicles.length, 0)}
                recentTrips={demoTrips}
              />
            } />
            <Route path="/tabs/profile" element={
              <ProfilePage
                userName="Budi Santoso"
                regionName="BADAU"
                userId="OFF-001"
                totalTrips={42}
                pendingSync={2}
                rating="4.8"
              />
            } />
            <Route path="/tabs/history" element={
              <HistoryPage
                trips={demoTrips.map(t => ({
                  ...t,
                  vehicleCount: t.vehicles.length,
                  time: new Date(t.createdAt).toLocaleString('id-ID'),
                }))}
              />
            } />
            <Route path="/create-trip" element={<CreateTripPage />} />
            <Route path="/input-vehicle" element={<InputVehiclePage />} />
            <Route path="/success/:id" element={
              <SuccessDialogPage
                trip={{
                  id: '123',
                  noTrip: 'TRIP-2026-003',
                  vehicles: [
                    { id: 'v1', noPolisi: 'KB 9831 DA', tarif: 150000 },
                  ],
                  isSynced: false,
                }}
              />
            } />
            <Route path="/trip-detail/:id" element={
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
              />
            } />
            <Route path="*" element={<Navigate to="/tabs/home" replace />} />
          </Routes>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
