import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface Route {
  code: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
}

const routes: Route[] = [
  { code: 'SJRE -> BADAU', from: 'Sjaransi RE', to: 'Badau Port', distance: '24 km', duration: '~45 menit' },
  { code: 'BADAU -> SBDZ', from: 'Badau Port', to: 'Sebong Distrik', distance: '18 km', duration: '~35 menit' },
  { code: 'SJRE -> SBDZ', from: 'Sjaransi RE', to: 'Sebong Distrik', distance: '32 km', duration: '~60 menit' },
  { code: 'SBDZ -> BADAU', from: 'Sebong Distrik', to: 'Badau Port', distance: '18 km', duration: '~35 menit' },
];

const RouteSelectScreen: React.FC<{ onSelect?: (route: string) => void }> = ({ onSelect }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="content">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Pilih Rute</h2>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>Tentukan asal dan tujuan perjalanan</p>

      <div className="badge badge-active" style={{ marginBottom: 16 }}>
        <Check size={14} /> Wilayah Aktif: BADAU
      </div>

      {routes.map(route => (
        <div
          key={route.code}
          className={`route-option ${selected === route.code ? 'selected' : ''}`}
          onClick={() => setSelected(route.code)}
        >
          <div className="radio">
            {selected === route.code && <div style={{ width: 8, height: 8, background: 'white', borderRadius: '50%' }} />}
          </div>
          <div className="route-details">
            <div className="route-code">{route.code}</div>
            <div className="route-meta">{route.from} → {route.to} · {route.distance} · {route.duration}</div>
          </div>
        </div>
      ))}

      <div style={{ height: 80 }} />
    </div>
  );
};

export default RouteSelectScreen;
