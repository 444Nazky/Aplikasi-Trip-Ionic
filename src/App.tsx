import React, { useState } from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Routes, Route, Navigate } from 'react-router-dom';

import { LoginPage } from './pages/LoginPage';
import { SimpleLoginPage } from './pages/SimpleLoginPage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { HistoryPage } from './pages/HistoryPage';
import { CreateTripPage } from './pages/CreateTripPage';
import { InputVehiclePage } from './pages/InputVehiclePage';
import { SuccessDialogPage } from './pages/SuccessDialogPage';
import { TripDetailPage } from './pages/TripDetailPage';

const demoTrips = [
  { id: '1', noTrip: 'TRIP-2026-001', rute: 'BADAU → PONTIANAK', status: 'completed', isSynced: true, muatan: 'Ada Muatan', vehicles: [{ id: 'v1', noPolisi: 'KB 9831 DA', jenis: 'Truk', golongan: 'Eksternal', muatan: 'Dengan Muatan', tarif: 150000 }], createdAt: new Date().toISOString() },
  { id: '2', noTrip: 'TRIP-2026-002', rute: 'BADAU → SANGGAU', status: 'in-progress', isSynced: false, muatan: 'Ada Muatan', vehicles: [{ id: 'v2', noPolisi: 'KB 1234 XX', jenis: 'Mobil', golongan: 'Internal', muatan: 'Tanpa Muatan', tarif: 0 }], createdAt: new Date(Date.now() - 3600000).toISOString() },
];

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <IonApp>
      <IonReactRouter>
        {!loggedIn ? (
          <IonRouterOutlet>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="r/login" replace />} />
            </Routes>
          </IonRouterOutlet>
        ) : (
          <IonRouterOutlet>
            <Routes>
              <Route path="/tabs/home" element={<HomePage userName="Budi Santoso" regionName="BADAU" isOnline={true} tripCount={demoTrips.length} vehicleCount={demoTrips.reduce((s, t) => s + t.vehicles.length, 0)} recentTrips={demoTrips} />} />
              <Route path="/tabs/profile" element={<ProfilePage userName="Budi Santoso" regionName="BADAU" totalTrips={42} pendingSync={2} />} />
              <Route path="/tabs/history" element={<HistoryPage trips={demoTrips.map(t => ({ ...t, vehicleCount: t.vehicles.length, time: new Date(t.createdAt).toLocaleString('id-ID') }))} />} />
              <Route path="/create-trip" element={<CreateTripPage />} />
              <Route path="/input-vehicle" element={<InputVehiclePage />} />
              <Route path="/success/:id" element={<SuccessDialogPage noTrip="TRIP-2026-003" vehicleCount={1} total={150000} />} />
              <Route path="/trip-detail/:id" element={<TripDetailPage trip={demoTrips[0]} />} />
              <Route path="*" element={<Navigate to="/tabs/home" replace />} />
            </Routes>
          </IonRouterOutlet>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
