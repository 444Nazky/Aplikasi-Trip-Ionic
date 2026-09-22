import { useState } from 'react'
import {
  Truck, Home, List, User, ArrowLeftRight, ChevronLeft, ChevronRight, ChevronDown,
  Camera, Lock, LayoutGrid, Table2, Users, BarChart2, Bell, Check, Map, Settings,
  MapPin, Star, LogOut, Play, Square, Plus, Pencil, Trash2, Download, ShieldCheck,
  Eye, EyeOff, Menu, X, RefreshCw, FileText, AlertCircle, Wifi, Battery,
  Signal, ArrowRight,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type AppMode = 'mobile' | 'admin'
type MobileScreen =
  | 'home' | 'route-select' | 'trip-condition' | 'vehicle-form'
  | 'camera' | 'trip-summary' | 'trip-active' | 'trip-complete'
  | 'history' | 'history-detail' | 'officer-switch' | 'pin-verify' | 'profile'
type AdminTab = 'overview' | 'tariff' | 'officers' | 'reports' | 'settings'

// ─── Data ─────────────────────────────────────────────────────────────────────
const ROUTES = [
  { code: 'SJRE-SBDZ', from: 'SJRE', to: 'SBDZ', label: 'Sijangkung → Sabadi', distance: '42 km', duration: '1j 10m' },
  { code: 'SBDZ-SJRE', from: 'SBDZ', to: 'SJRE', label: 'Sabadi → Sijangkung', distance: '42 km', duration: '1j 10m' },
  { code: 'SJRE-BDAU', from: 'SJRE', to: 'BDAU', label: 'Sijangkung → Badau', distance: '18 km', duration: '35m' },
  { code: 'BDAU-SJRE', from: 'BDAU', to: 'SJRE', label: 'Badau → Sijangkung', distance: '18 km', duration: '35m' },
]

const allTrips = [
  { id: 'TRP-2026-0091', route: 'SJRE → SBDZ', status: 'Selesai', time: '08:42', date: '21 Sep 2026', load: 'Ada Muatan', vehicle: 'B 3821 KDA', type: 'Truck Sedang', category: 'Internal', revenue: 'Rp 280.000', officer: 'Budi Santoso', duration: '1j 08m', photo: true },
  { id: 'TRP-2026-0090', route: 'SBDZ → SJRE', status: 'Selesai', time: '06:15', date: '21 Sep 2026', load: 'Kosong', vehicle: 'B 3821 KDA', type: 'Truck Sedang', category: 'Internal', revenue: 'Rp 0', officer: 'Budi Santoso', duration: '1j 12m', photo: false },
  { id: 'TRP-2026-0089', route: 'SJRE → SBDZ', status: 'Selesai', time: '14:30', date: '20 Sep 2026', load: 'Ada Muatan', vehicle: 'KA 1142 AR', type: 'Truck Besar', category: 'Eksternal (Berganji)', revenue: 'Rp 450.000', officer: 'Andi Pratama', duration: '1j 22m', photo: true },
  { id: 'TRP-2026-0088', route: 'SBDZ → SJRE', status: 'Selesai', time: '11:00', date: '20 Sep 2026', load: 'Ada Muatan', vehicle: 'KA 4471 BX', type: 'Mobil', category: 'Eksternal (Tanpa Garansi)', revenue: 'Rp 45.000', officer: 'Siti Rahayu', duration: '58m', photo: true },
  { id: 'TRP-2026-0087', route: 'SJRE → BDAU', status: 'Selesai', time: '09:00', date: '19 Sep 2026', load: 'Ada Muatan', vehicle: 'B 9912 ZZ', type: 'Motor', category: 'Internal', revenue: 'Rp 15.000', officer: 'Budi Santoso', duration: '33m', photo: true },
  { id: 'TRP-2026-0086', route: 'BDAU → SJRE', status: 'Selesai', time: '07:45', date: '19 Sep 2026', load: 'Kosong', vehicle: 'B 9912 ZZ', type: 'Motor', category: 'Internal', revenue: 'Rp 0', officer: 'Budi Santoso', duration: '37m', photo: false },
]

const tariffData = [
  { golongan: 'I', type: 'Motor', loaded: 'Rp 15.000', loadedNum: 15000, empty: 'Rp 8.000', emptyNum: 8000, desc: 'Sepeda motor roda dua' },
  { golongan: 'II', type: 'Mobil', loaded: 'Rp 45.000', loadedNum: 45000, empty: 'Rp 20.000', emptyNum: 20000, desc: 'Mobil penumpang / pickup kecil' },
  { golongan: 'III', type: 'Truck Kecil', loaded: 'Rp 120.000', loadedNum: 120000, empty: 'Rp 55.000', emptyNum: 55000, desc: 'Truck ringan s/d 3 ton' },
  { golongan: 'IV', type: 'Truck Sedang', loaded: 'Rp 280.000', loadedNum: 280000, empty: 'Rp 130.000', emptyNum: 130000, desc: 'Truck sedang 3–8 ton' },
  { golongan: 'V', type: 'Truck Besar', loaded: 'Rp 450.000', loadedNum: 450000, empty: 'Rp 200.000', emptyNum: 200000, desc: 'Truck besar / trailer di atas 8 ton' },
]

const officerList = [
  { id: 1, name: 'Budi Santoso', initials: 'BS', region: 'BADAU', pin: '••••••', status: 'Aktif', device: 'iPhone 14', trips: 91, lastActive: 'Hari ini 08:42', joined: '12 Jan 2025' },
  { id: 2, name: 'Andi Pratama', initials: 'AP', region: 'BADAU', pin: '••••••', status: 'Aktif', device: 'Samsung A54', trips: 78, lastActive: 'Hari ini 06:30', joined: '3 Mar 2025' },
  { id: 3, name: 'Siti Rahayu', initials: 'SR', region: 'BADAU', pin: '••••••', status: 'Nonaktif', device: 'Redmi 12', trips: 43, lastActive: '15 Sep 2026', joined: '22 Jun 2025' },
  { id: 4, name: 'Rizky Maulana', initials: 'RM', region: 'ENTIKONG', pin: '••••••', status: 'Aktif', device: 'Oppo A78', trips: 112, lastActive: 'Hari ini 09:15', joined: '8 Feb 2025' },
  { id: 5, name: 'Dewi Kusuma', initials: 'DK', region: 'ENTIKONG', pin: '••••••', status: 'Aktif', device: 'iPhone 13', trips: 65, lastActive: 'Kemarin 14:00', joined: '17 Apr 2025' },
]

// ─── Mobile Status Bar ────────────────────────────────────────────────────────
function StatusBar({ light = false }: { light?: boolean }) {
  const c = light ? 'text-white' : 'text-slate-800'
  return (
    <div className={`flex justify-between items-center px-6 pt-4 pb-1 shrink-0 ${c}`}>
      <span className="text-[13px] font-bold tracking-tight">09:41</span>
      <div className="flex gap-1.5 items-center">
        <Signal size={14} strokeWidth={2.5} />
        <Wifi size={14} strokeWidth={2.5} />
        <Battery size={16} strokeWidth={2.5} />
      </div>
    </div>
  )
}

// ─── Mobile Shell ─────────────────────────────────────────────────────────────
function MobileShell({ children, activeNav, onNav }: { children: React.ReactNode; activeNav: string; onNav: (s: MobileScreen) => void }) {
  return (
    <div className="w-[390px] h-[844px] bg-[#F1F5F9] rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.22)] overflow-hidden relative flex flex-col border border-slate-300/60" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.8)' }}>
      <StatusBar />
      <div className="flex-1 overflow-y-auto hide-scrollbar">{children}</div>
      {/* Bottom Nav */}
      <div className="shrink-0 px-4 pb-7 pt-2 bg-[#F1F5F9]">
        <div className="bg-white rounded-[22px] shadow-[0_4px_20px_rgba(0,0,0,0.10)] flex justify-around items-center py-3 px-2 border border-slate-100">
          {([
            ['home', 'Beranda', Home],
            ['history', 'Riwayat', List],
            ['profile', 'Profil', User],
          ] as [MobileScreen, string, React.ElementType][]).map(([s, label, Icon]) => (
            <button
              key={s}
              onClick={() => onNav(s)}
              className={`flex flex-col items-center gap-1 px-6 py-1.5 rounded-2xl transition-all ${activeNav === s ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Icon size={20} strokeWidth={activeNav === s ? 2.5 : 1.8} />
              <span className={`text-[10px] font-semibold ${activeNav === s ? 'font-bold' : ''}`}>{label}</span>
              {activeNav === s && <div className="w-1 h-1 rounded-full bg-blue-600 -mt-0.5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
function HomeScreen({ go }: { go: (s: MobileScreen) => void }) {
  return (
    <div className="px-4 pt-1 pb-4 space-y-3.5 animate-fade-in">
      {/* Officer Card */}
      <div className="bg-[#0F172A] rounded-[28px] p-5 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-blue-500/10" />
        <div className="absolute -right-2 -bottom-4 w-20 h-20 rounded-full bg-slate-700/40" />
        <div className="relative flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center font-black text-white text-base shadow-lg">BS</div>
            <div>
              <p className="text-slate-400 text-[11px] font-medium">Petugas Lapangan</p>
              <p className="font-bold text-white text-[15px] leading-tight">Budi Santoso</p>
            </div>
          </div>
          <button
            onClick={() => go('officer-switch')}
            className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors text-slate-300"
          >
            <ArrowLeftRight size={15} />
          </button>
        </div>
        <div className="flex items-center gap-2.5 bg-slate-800/60 rounded-2xl px-3.5 py-2.5 relative">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium text-slate-400">Region Locked:</span>
          <span className="text-[11px] font-black text-emerald-400 tracking-widest">BADAU</span>
          <span className="ml-auto text-[10px] text-slate-600">Sejak 07:00</span>
        </div>
      </div>

      {/* Trip CTA */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[28px] p-5 relative overflow-hidden">
        <div className="absolute right-4 top-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute right-10 bottom-3 w-14 h-14 rounded-full bg-blue-800/40" />
        <div className="relative">
          <p className="text-blue-100 text-[11px] font-semibold mb-0.5">Siap bertugas?</p>
          <h2 className="text-white font-black text-[22px] leading-tight mb-4">Mulai Trip<br />Baru Sekarang</h2>
          <button
            onClick={() => go('route-select')}
            className="bg-white text-blue-700 font-bold py-3.5 rounded-2xl text-[13px] hover:bg-blue-50 active:scale-95 transition-all w-full flex items-center justify-center gap-2 shadow-lg"
          >
            Mulai Trip <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: 'Trip Hari Ini', val: '3', sub: '↑ +1', color: 'blue' },
          { label: 'Kendaraan', val: '5', sub: 'Hari ini', color: 'slate' },
          { label: 'Pendapatan', val: '730rb', sub: 'Rp hari ini', color: 'emerald' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
            <p className={`text-[18px] font-black ${s.color === 'blue' ? 'text-blue-600' : s.color === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`}>{s.val}</p>
            <p className="text-[10px] font-semibold text-slate-700 mt-0.5 leading-snug">{s.label}</p>
            <p className="text-[10px] text-slate-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="font-bold text-slate-800 text-[13px]">Trip Terbaru</h3>
          <button onClick={() => go('history')} className="text-blue-600 text-[11px] font-bold flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={13} />
          </button>
        </div>
        <div className="space-y-2">
          {allTrips.slice(0, 3).map(t => (
            <button
              key={t.id}
              onClick={() => go('history-detail')}
              className="w-full bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100 flex items-center gap-3 hover:shadow-md active:scale-[0.98] transition-all text-left"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.load === 'Ada Muatan' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                <Truck size={18} className={t.load === 'Ada Muatan' ? 'text-blue-500' : 'text-slate-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-slate-800">{t.route}</p>
                <p className="text-[10px] text-slate-400 truncate">{t.time} · {t.vehicle}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[12px] font-bold text-slate-900">{t.revenue}</p>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${t.load === 'Ada Muatan' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{t.load}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Route Select ─────────────────────────────────────────────────────────────
function RouteSelectScreen({ go }: { go: (s: MobileScreen) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  return (
    <div className="px-4 pt-2 pb-4 animate-fade-in">
      <button onClick={() => go('home')} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-4 hover:text-slate-700 font-medium">
        <ChevronLeft size={16} /> Kembali
      </button>
      <h2 className="font-black text-slate-900 text-[20px] mb-0.5">Pilih Rute</h2>
      <p className="text-slate-500 text-[13px] mb-4">Tentukan asal dan tujuan perjalanan</p>

      <div className="bg-[#0F172A] rounded-2xl p-4 mb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <MapPin size={16} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wide">Wilayah Aktif</p>
          <p className="text-white font-bold text-[13px]">BADAU</p>
        </div>
        <Map size={16} className="text-slate-600 ml-auto" />
      </div>

      <div className="space-y-2.5 mb-5">
        {ROUTES.map(r => (
          <button
            key={r.code}
            onClick={() => setSelected(r.code)}
            className={`w-full rounded-2xl p-4 text-left border-2 transition-all ${selected === r.code ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected === r.code ? 'bg-blue-600' : 'bg-slate-100'}`}>
                  <Map size={16} className={selected === r.code ? 'text-white' : 'text-slate-500'} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-[13px]">{r.from} → {r.to}</p>
                  <p className="text-[11px] text-slate-400">{r.label}</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selected === r.code ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                {selected === r.code && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
            <div className="flex gap-4 pl-[52px]">
              <span className="text-[10px] text-slate-400">📏 {r.distance}</span>
              <span className="text-[10px] text-slate-400">⏱ {r.duration}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => go('trip-condition')}
        disabled={!selected}
        className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-2xl text-[13px] disabled:opacity-40 hover:bg-slate-800 active:scale-[0.98] transition-all"
      >
        Pilih Rute Ini
      </button>
    </div>
  )
}

// ─── Trip Condition ───────────────────────────────────────────────────────────
function TripConditionScreen({ go }: { go: (s: MobileScreen) => void }) {
  const [condition, setCondition] = useState<'kosong' | 'muatan' | null>(null)
  return (
    <div className="px-4 pt-2 pb-4 animate-fade-in">
      <button onClick={() => go('route-select')} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-4 hover:text-slate-700 font-medium">
        <ChevronLeft size={16} /> Kembali
      </button>
      <h2 className="font-black text-slate-900 text-[20px] mb-0.5">Kondisi Trip</h2>
      <p className="text-slate-500 text-[13px] mb-4">Pilih kondisi angkutan untuk trip ini</p>

      <div className="bg-white rounded-2xl px-4 py-3.5 mb-4 shadow-sm border border-slate-100 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Rute Terpilih</p>
          <p className="font-bold text-slate-800 text-[13px]">SJRE → SBDZ</p>
          <p className="text-[10px] text-slate-400">42 km · ±1j 10m</p>
        </div>
        <button onClick={() => go('route-select')} className="text-blue-600 text-[11px] font-bold">Ubah</button>
      </div>

      <div className="space-y-3 mb-5">
        {[
          { key: 'kosong', label: 'Angkutan Kosong', desc: 'Kendaraan berjalan tanpa muatan — tarif Kosong berlaku', emoji: '🚛', tariff: 'Rp 130.000' },
          { key: 'muatan', label: 'Ada Muatan', desc: 'Kendaraan membawa muatan barang — tarif Muatan berlaku', emoji: '📦', tariff: 'Rp 280.000' },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => setCondition(opt.key as 'kosong' | 'muatan')}
            className={`w-full rounded-3xl p-5 text-left border-2 transition-all ${condition === opt.key ? opt.key === 'muatan' ? 'border-blue-500 bg-blue-50' : 'border-slate-400 bg-slate-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${condition === opt.key && opt.key === 'muatan' ? 'bg-blue-100' : condition === opt.key ? 'bg-slate-200' : 'bg-slate-100'}`}>{opt.emoji}</div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-[13px] mb-0.5">{opt.label}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
                <p className={`text-[11px] font-bold mt-1.5 ${condition === opt.key && opt.key === 'muatan' ? 'text-blue-600' : condition === opt.key ? 'text-slate-700' : 'text-slate-400'}`}>Estimasi: {opt.tariff}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${condition === opt.key ? opt.key === 'muatan' ? 'border-blue-500 bg-blue-500' : 'border-slate-500 bg-slate-500' : 'border-slate-200'}`}>
                {condition === opt.key && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => condition === 'muatan' ? go('vehicle-form') : go('trip-active')}
        disabled={!condition}
        className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-2xl text-[13px] disabled:opacity-40 hover:bg-slate-800 active:scale-[0.98] transition-all"
      >
        {condition === 'muatan' ? 'Lanjut Input Kendaraan' : 'Mulai Trip Kosong'}
      </button>
    </div>
  )
}

// ─── Vehicle Form ─────────────────────────────────────────────────────────────
function VehicleFormScreen({ go }: { go: (s: MobileScreen) => void }) {
  const [vehicleType, setVehicleType] = useState('')
  const [category, setCategory] = useState('')
  const [plate, setPlate] = useState('')
  const [photoTaken, setPhotoTaken] = useState(false)
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="px-4 pt-2 pb-4 animate-fade-in">
      <button onClick={() => go('trip-condition')} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-4 hover:text-slate-700 font-medium">
        <ChevronLeft size={16} /> Kembali
      </button>
      <h2 className="font-black text-slate-900 text-[20px] mb-0.5">Data Kendaraan</h2>
      <p className="text-slate-500 text-[13px] mb-4">Lengkapi informasi kendaraan yang dibawa</p>

      {/* Steps */}
      <div className="flex items-center gap-1.5 mb-5">
        {['Rute', 'Kondisi', 'Kendaraan', 'Selesai'].map((step, i) => (
          <div key={step} className="flex items-center gap-1.5 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${i <= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
              {i < 2 ? <Check size={12} strokeWidth={3} /> : i + 1}
            </div>
            {i < 3 && <div className={`flex-1 h-[2px] rounded-full ${i < 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold text-slate-600 mb-2 block uppercase tracking-wide">Kategori Kendaraan</label>
          <div className="space-y-2">
            {[
              { key: 'Internal', badge: 'Internal', color: 'bg-slate-800 text-white' },
              { key: 'Eksternal (Berganji)', badge: 'Ekst. Berganji', color: 'bg-amber-500 text-white' },
              { key: 'Eksternal (Tanpa Garansi)', badge: 'Ekst. Tanpa Garansi', color: 'bg-rose-500 text-white' },
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`w-full rounded-xl px-4 py-3 text-left flex items-center justify-between border-2 transition-all ${category === cat.key ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
              >
                <span className="text-[13px] font-medium text-slate-700">{cat.key}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.color}`}>{cat.badge}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 mb-2 block uppercase tracking-wide">No. Polisi</label>
          <input
            value={plate}
            onChange={e => setPlate(e.target.value.toUpperCase())}
            placeholder="Contoh: B 1234 XY"
            className="w-full bg-white border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] font-mono font-bold tracking-widest text-slate-900 placeholder:text-slate-300 placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 mb-2 block uppercase tracking-wide">Jenis Kendaraan</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ k: 'Motor', e: '🏍️' }, { k: 'Mobil', e: '🚗' }, { k: 'Truck', e: '🚛' }].map(vt => (
              <button
                key={vt.k}
                onClick={() => setVehicleType(vt.k)}
                className={`py-3.5 rounded-xl text-[11px] font-bold border-2 flex flex-col items-center gap-1.5 transition-all ${vehicleType === vt.k ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'}`}
              >
                <span className="text-xl">{vt.e}</span>{vt.k}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-600 mb-2 block uppercase tracking-wide">Foto Bukti Muatan</label>
          <button
            onClick={() => go('camera')}
            className={`w-full rounded-2xl border-2 border-dashed py-6 flex flex-col items-center gap-2 transition-all ${photoTaken ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-blue-300'}`}
          >
            {photoTaken ? (
              <><span className="text-3xl">✅</span><span className="text-[12px] font-bold text-emerald-600">Foto berhasil diambil</span><span className="text-[10px] text-emerald-500">Ketuk untuk ulang</span></>
            ) : (
              <><Camera size={28} className="text-slate-400" /><span className="text-[12px] font-semibold text-slate-500">Ambil Foto Selfie + Muatan</span><span className="text-[10px] text-slate-400">Pastikan kendaraan & muatan terlihat</span></>
            )}
          </button>
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={!photoTaken || !plate || !vehicleType || !category}
          className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-2xl text-[13px] disabled:opacity-40 hover:bg-slate-800 active:scale-[0.98] transition-all"
        >
          Simpan Data Kendaraan
        </button>
      </div>

      {showModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-end z-20">
          <div className="w-full bg-white rounded-t-3xl p-6 animate-slide-up">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />
            <h3 className="text-slate-900 font-bold text-[17px] text-center mb-1">Tambah Kendaraan?</h3>
            <p className="text-slate-500 text-[13px] text-center mb-5">Input kendaraan tambahan untuk trip yang sama?</p>
            <div className="bg-slate-50 rounded-2xl p-4 mb-5">
              <div className="flex justify-between text-[12px] mb-1.5"><span className="text-slate-500">No. Polisi</span><span className="font-bold font-mono text-slate-800">{plate}</span></div>
              <div className="flex justify-between text-[12px] mb-1.5"><span className="text-slate-500">Jenis</span><span className="font-semibold text-slate-700">{vehicleType}</span></div>
              <div className="flex justify-between text-[12px]"><span className="text-slate-500">Kategori</span><span className="font-semibold text-slate-700">{category}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowModal(false); go('trip-summary') }} className="flex-1 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-50">Tidak, Lanjutkan</button>
              <button onClick={() => { setShowModal(false); setPlate(''); setVehicleType(''); setCategory(''); setPhotoTaken(false) }} className="flex-1 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-[13px] hover:bg-blue-700">Ya, Tambah</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Camera ───────────────────────────────────────────────────────────────────
function CameraScreen({ go }: { go: (s: MobileScreen) => void }) {
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="relative bg-slate-950 flex-1 flex items-center justify-center" style={{ minHeight: 560 }}>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/40" />
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
          <button onClick={() => go('vehicle-form')} className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 text-white">
            <ChevronLeft size={20} />
          </button>
          <div className="bg-black/50 rounded-full px-4 py-2">
            <span className="text-white text-[12px] font-semibold">Foto Bukti Muatan</span>
          </div>
          <div className="w-10" />
        </div>
        <div className="absolute inset-8 grid grid-cols-3 grid-rows-3 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => <div key={i} className="border border-white/10" />)}
        </div>
        <div className="relative w-64 h-64">
          {([['top-0 left-0', 'border-t-2 border-l-2 rounded-tl-2xl'], ['top-0 right-0', 'border-t-2 border-r-2 rounded-tr-2xl'], ['bottom-0 left-0', 'border-b-2 border-l-2 rounded-bl-2xl'], ['bottom-0 right-0', 'border-b-2 border-r-2 rounded-br-2xl']] as [string, string][]).map(([pos, border], i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8 border-white ${border}`} />
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Camera size={40} className="text-white/30" />
            <span className="text-white/40 text-[11px] text-center px-8">Arahkan ke selfie + muatan kendaraan</span>
          </div>
        </div>
      </div>
      <div className="bg-slate-950 flex items-center justify-center py-8 gap-12">
        <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
          <RefreshCw size={18} />
        </button>
        <button onClick={() => go('vehicle-form')} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform">
          <div className="w-14 h-14 rounded-full bg-white" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center">
          <span className="text-slate-600 text-[10px]">—</span>
        </div>
      </div>
    </div>
  )
}

// ─── Trip Summary ─────────────────────────────────────────────────────────────
function TripSummaryScreen({ go }: { go: (s: MobileScreen) => void }) {
  return (
    <div className="px-4 pt-2 pb-4 animate-fade-in">
      <button onClick={() => go('vehicle-form')} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-4 hover:text-slate-700 font-medium">
        <ChevronLeft size={16} /> Kembali
      </button>
      <h2 className="font-black text-slate-900 text-[20px] mb-0.5">Ringkasan Trip</h2>
      <p className="text-slate-500 text-[13px] mb-4">Periksa data sebelum memulai trip</p>

      <div className="bg-[#0F172A] rounded-3xl p-5 mb-4 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Truck size={18} className="text-white" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px]">ID Trip (Auto-generate)</p>
            <p className="font-mono font-black text-[13px]">TRP-2026-0092</p>
          </div>
          <span className="ml-auto text-[10px] font-black bg-amber-500 text-white px-2.5 py-1 rounded-full">Draft</span>
        </div>
        <div className="space-y-2.5">
          {[['Rute', 'SJRE → SBDZ'], ['Kondisi', 'Ada Muatan'], ['Petugas', 'Budi Santoso'], ['Tanggal', '21 Sep 2026 · 09:41']].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center border-b border-slate-800 pb-2.5">
              <span className="text-slate-400 text-[11px]">{k}</span>
              <span className="text-white text-[11px] font-semibold">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
        <p className="text-[11px] font-bold text-slate-600 mb-3 uppercase tracking-wide">Kendaraan (2)</p>
        {[
          { plate: 'B 3821 KDA', type: 'Truck Sedang', cat: 'Internal', tariff: 'Rp 280.000' },
          { plate: 'KA 9901 ZX', type: 'Mobil', cat: 'Eksternal (Berganji)', tariff: 'Rp 45.000' },
        ].map((v, i) => (
          <div key={i} className={`flex items-center gap-3 ${i > 0 ? 'pt-3 border-t border-slate-100 mt-3' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg">🚛</div>
            <div className="flex-1">
              <p className="font-mono text-[11px] font-black text-slate-800">{v.plate}</p>
              <p className="text-[10px] text-slate-400">{v.type} · {v.cat}</p>
            </div>
            <p className="text-[11px] font-bold text-emerald-700">{v.tariff}</p>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
          <span className="text-[11px] font-semibold text-slate-600">Total Tarif</span>
          <span className="text-[15px] font-black text-slate-900">Rp 325.000</span>
        </div>
      </div>

      <button onClick={() => go('trip-active')} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-[13px] hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
        <Play size={15} fill="white" /> Mulai Trip Sekarang
      </button>
      <button onClick={() => go('home')} className="w-full mt-2 py-3.5 rounded-2xl text-slate-500 font-semibold text-[13px] hover:bg-slate-100 transition-colors">Batal</button>
    </div>
  )
}

// ─── Trip Active ──────────────────────────────────────────────────────────────
function TripActiveScreen({ go }: { go: (s: MobileScreen) => void }) {
  return (
    <div className="px-4 pt-2 pb-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-black text-slate-900 text-[20px]">Trip Berlangsung</h2>
        <span className="text-[11px] font-bold bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> In Transit
        </span>
      </div>

      <div className="bg-[#0F172A] rounded-3xl p-6 mb-4 text-center">
        <p className="text-slate-400 text-[11px] mb-2 uppercase tracking-wide">Durasi Berjalan</p>
        <p className="text-white font-mono font-black text-[40px] tracking-widest mb-3">00:23:14</p>
        <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }} />
        </div>
        <p className="text-slate-500 text-[11px]">Estimasi tiba: ±47 menit lagi</p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <div className="w-0.5 h-12 bg-slate-200" />
            <div className="w-3 h-3 rounded-full border-2 border-slate-300" />
          </div>
          <div className="flex-1 flex flex-col justify-between h-16">
            <div><p className="font-bold text-slate-900 text-[13px]">SJRE – Sijangkung</p><p className="text-[10px] text-slate-400">Titik Keberangkatan · 09:41</p></div>
            <div><p className="font-bold text-slate-500 text-[13px]">SBDZ – Sabadi</p><p className="text-[10px] text-slate-400">Estimasi tiba: ~10:51</p></div>
          </div>
          <div className="text-right">
            <p className="font-bold text-blue-600 text-[13px]">42 km</p>
            <p className="text-[10px] text-slate-400">Sisa ~29 km</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
        <p className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wide">Kendaraan Diangkut</p>
        {[{ plate: 'B 3821 KDA', type: 'Truck Sedang' }, { plate: 'KA 9901 ZX', type: 'Mobil' }].map((v, i) => (
          <div key={i} className={`flex items-center gap-3 ${i > 0 ? 'pt-2.5 border-t border-slate-100 mt-2.5' : ''}`}>
            <span className="text-lg">🚛</span>
            <div><p className="font-mono text-[11px] font-black text-slate-800">{v.plate}</p><p className="text-[10px] text-slate-400">{v.type}</p></div>
          </div>
        ))}
      </div>

      <button onClick={() => go('trip-complete')} className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl text-[13px] hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
        <Square size={14} fill="white" /> Selesaikan Trip
      </button>
    </div>
  )
}

// ─── Trip Complete ────────────────────────────────────────────────────────────
function TripCompleteScreen({ go }: { go: (s: MobileScreen) => void }) {
  return (
    <div className="px-4 pt-6 pb-4 flex flex-col items-center animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-emerald-100 flex items-center justify-center mb-4">
        <Check size={38} className="text-emerald-500" strokeWidth={3} />
      </div>
      <h2 className="font-black text-slate-900 text-[24px] mb-1 text-center">Trip Selesai!</h2>
      <p className="text-slate-500 text-[13px] text-center mb-5">Trip TRP-2026-0092 berhasil dicatat dan disimpan</p>

      <div className="w-full bg-[#0F172A] rounded-3xl p-5 mb-4">
        <div className="grid grid-cols-2 gap-4">
          {[{ label: 'Rute', val: 'SJRE → SBDZ' }, { label: 'Durasi', val: '1j 09m' }, { label: 'Kendaraan', val: '2 unit' }, { label: 'Total Tarif', val: 'Rp 325.000' }].map(({ label, val }) => (
            <div key={label}>
              <p className="text-slate-500 text-[10px] mb-0.5">{label}</p>
              <p className="text-white font-bold text-[13px]">{val}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
        <Check size={18} className="text-emerald-500" strokeWidth={2.5} />
        <div>
          <p className="text-[12px] font-bold text-emerald-700">Data Tersimpan ke Server</p>
          <p className="text-[10px] text-emerald-600">21 Sep 2026 · 10:50 WIB</p>
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <button onClick={() => go('history-detail')} className="flex-1 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-50">Lihat Detail</button>
        <button onClick={() => go('home')} className="flex-1 py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-[13px] hover:bg-blue-700">Kembali ke Home</button>
      </div>
    </div>
  )
}

// ─── History ──────────────────────────────────────────────────────────────────
function HistoryScreen({ go }: { go: (s: MobileScreen) => void }) {
  const [filter, setFilter] = useState<'all' | 'muatan' | 'kosong'>('all')
  const filtered = filter === 'all' ? allTrips : allTrips.filter(t => filter === 'muatan' ? t.load === 'Ada Muatan' : t.load === 'Kosong')
  return (
    <div className="px-4 pt-2 pb-4 animate-fade-in">
      <h2 className="font-black text-slate-900 text-[20px] mb-3">Riwayat Trip</h2>
      <div className="flex gap-2 mb-4">
        {([['all', 'Semua'], ['muatan', 'Muatan'], ['kosong', 'Kosong']] as [typeof filter, string][]).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-4 py-1.5 rounded-xl text-[12px] font-bold transition-all ${filter === k ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'}`}
          >{l}</button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.map(t => (
          <button
            key={t.id}
            onClick={() => go('history-detail')}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-start gap-3 text-left hover:shadow-md active:scale-[0.98] transition-all"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.load === 'Ada Muatan' ? 'bg-blue-100' : 'bg-slate-100'}`}>
              <Truck size={18} className={t.load === 'Ada Muatan' ? 'text-blue-500' : 'text-slate-400'} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-0.5">
                <p className="text-[12px] font-bold text-slate-900">{t.route}</p>
                <p className="text-[12px] font-bold text-slate-900 ml-2">{t.revenue}</p>
              </div>
              <p className="font-mono text-[10px] text-slate-400">{t.id}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] text-slate-400">{t.date} · {t.time}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${t.load === 'Ada Muatan' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{t.load}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── History Detail ───────────────────────────────────────────────────────────
function HistoryDetailScreen({ go }: { go: (s: MobileScreen) => void }) {
  const t = allTrips[0]
  return (
    <div className="px-4 pt-2 pb-4 animate-fade-in">
      <button onClick={() => go('history')} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-4 hover:text-slate-700 font-medium">
        <ChevronLeft size={16} /> Riwayat
      </button>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-[11px] text-slate-400">{t.id}</p>
          <h2 className="font-black text-slate-900 text-[18px]">{t.route}</h2>
        </div>
        <span className="text-[11px] font-bold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full">{t.status}</span>
      </div>

      <div className="bg-[#0F172A] rounded-3xl p-5 mb-4">
        <div className="grid grid-cols-2 gap-4">
          {[{ l: 'Tanggal', v: t.date }, { l: 'Jam Mulai', v: t.time }, { l: 'Durasi', v: t.duration }, { l: 'Petugas', v: t.officer }].map(({ l, v }) => (
            <div key={l}><p className="text-slate-500 text-[10px] mb-0.5">{l}</p><p className="text-white font-semibold text-[12px]">{v}</p></div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
        <p className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wide">Detail Kendaraan</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">🚛</div>
          <div className="flex-1">
            <p className="font-mono text-[12px] font-black text-slate-900">{t.vehicle}</p>
            <p className="text-[10px] text-slate-400">{t.type} · {t.category}</p>
          </div>
          <p className="text-[12px] font-bold text-emerald-700">{t.revenue}</p>
        </div>
        <div className="mt-3 pt-3 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
          <span className="text-[11px] font-semibold text-slate-500">Total Pendapatan</span>
          <span className="text-[16px] font-black text-slate-900">{t.revenue}</span>
        </div>
      </div>

      {t.photo && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
          <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wide">Foto Bukti</p>
          <div className="bg-slate-100 rounded-xl h-32 flex items-center justify-center">
            <div className="text-center"><Camera size={28} className="text-slate-300 mx-auto" /><p className="text-[10px] text-slate-400 mt-1">Foto tersimpan</p></div>
          </div>
        </div>
      )}

      <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <Check size={16} className="text-emerald-500" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-700">Sudah tersinkronisasi</p>
          <p className="text-[10px] text-slate-400">Data diterima server · {t.date}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Officer Switch ───────────────────────────────────────────────────────────
function OfficerSwitchScreen({ go }: { go: (s: MobileScreen) => void }) {
  return (
    <div className="px-4 pt-2 pb-4 animate-fade-in">
      <button onClick={() => go('home')} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-4 hover:text-slate-700 font-medium">
        <ChevronLeft size={16} /> Kembali
      </button>
      <div className="bg-[#0F172A] rounded-3xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-2">
          <Lock size={14} className="text-amber-400" />
          <span className="text-amber-400 text-[11px] font-black tracking-widest uppercase">Region Lock Aktif</span>
        </div>
        <h2 className="text-white font-black text-[18px] mb-0.5">Ganti Petugas</h2>
        <p className="text-slate-400 text-[12px]">Hanya petugas wilayah <span className="text-emerald-400 font-black">BADAU</span> yang ditampilkan</p>
      </div>
      <div className="space-y-3">
        {officerList.filter(o => o.region === 'BADAU').map(o => (
          <button
            key={o.id}
            onClick={() => o.status === 'Aktif' && go('pin-verify')}
            className={`w-full bg-white rounded-2xl px-4 py-4 shadow-sm border border-slate-100 flex items-center gap-4 text-left transition-all ${o.status === 'Nonaktif' ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:scale-[0.98]'}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${o.status === 'Aktif' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{o.initials}</div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 text-[13px]">{o.name}</p>
              <p className="text-[11px] text-slate-400">{o.device} · {o.trips} trip</p>
              <p className="text-[10px] text-slate-300">Terakhir aktif: {o.lastActive}</p>
            </div>
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${o.status === 'Aktif' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{o.status}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── PIN Verify ───────────────────────────────────────────────────────────────
function PinVerifyScreen({ go }: { go: (s: MobileScreen) => void }) {
  const [digits, setDigits] = useState<string[]>([])
  const [error, setError] = useState(false)
  const press = (d: string) => {
    setError(false)
    if (d === 'del') { setDigits(p => p.slice(0, -1)); return }
    if (digits.length < 6) setDigits(p => [...p, d])
  }
  const confirm = () => {
    if (digits.join('') === '123456') go('home')
    else { setError(true); setTimeout(() => setDigits([]), 600) }
  }
  return (
    <div className="px-4 pt-2 pb-4 flex flex-col items-center animate-fade-in">
      <button onClick={() => go('officer-switch')} className="self-start flex items-center gap-1.5 text-slate-500 text-[13px] mb-8 hover:text-slate-700 font-medium">
        <ChevronLeft size={16} /> Kembali
      </button>
      <div className="w-16 h-16 rounded-3xl bg-[#0F172A] flex items-center justify-center mb-4 shadow-lg">
        <Lock size={28} className="text-amber-400" />
      </div>
      <h2 className="font-black text-slate-900 text-[22px] mb-1">Verifikasi PIN</h2>
      <p className="text-slate-500 text-[13px] text-center mb-1">Masukkan 6-digit PIN Anda</p>
      <p className="text-slate-400 text-[11px] mb-7">Demo: gunakan PIN <span className="font-mono font-black text-blue-600">123456</span></p>

      <div className="flex gap-3 mb-7">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition-all ${error ? 'border-red-400 bg-red-50' : i < digits.length ? 'border-blue-500 bg-blue-500' : 'border-slate-200 bg-white'}`}
          >
            {i < digits.length && <div className={`w-3 h-3 rounded-full ${error ? 'bg-red-400' : 'bg-white'}`} />}
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-[12px] font-semibold mb-3 animate-fade-in">PIN salah. Coba lagi.</p>}

      <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map(key => (
          key === '' ? <div key="empty" /> :
            <button
              key={key}
              onClick={() => press(key)}
              className={`h-14 rounded-2xl font-bold text-lg flex items-center justify-center transition-all active:scale-95 ${key === 'del' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 text-sm' : 'bg-white shadow-sm text-slate-900 hover:bg-slate-50 border border-slate-100'}`}
            >
              {key === 'del' ? '⌫' : key}
            </button>
        ))}
      </div>
      <button
        onClick={confirm}
        disabled={digits.length < 6}
        className="mt-6 w-full max-w-[260px] bg-[#0F172A] text-white font-bold py-4 rounded-2xl text-[13px] disabled:opacity-40 hover:bg-slate-800 active:scale-[0.98] transition-all"
      >
        Konfirmasi
      </button>
    </div>
  )
}

// ─── Profile ──────────────────────────────────────────────────────────────────
function ProfileScreen({ go }: { go: (s: MobileScreen) => void }) {
  return (
    <div className="px-4 pt-2 pb-4 animate-fade-in">
      <h2 className="font-black text-slate-900 text-[20px] mb-4">Profil Saya</h2>

      <div className="bg-[#0F172A] rounded-3xl p-5 flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center font-black text-white text-2xl shadow-lg">BS</div>
        <div>
          <p className="text-white font-black text-[17px]">Budi Santoso</p>
          <p className="text-slate-400 text-[11px]">Petugas Lapangan · ID: OFF-001</p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-emerald-400 text-[10px] font-black">BADAU · Aktif</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[{ v: '91', l: 'Total Trip' }, { v: 'Rp 12jt', l: 'Total Rev.' }, { v: '4.8', l: 'Rating', star: true }].map(s => (
          <div key={s.l} className="bg-white rounded-2xl p-3.5 text-center shadow-sm border border-slate-100">
            <div className="flex items-center justify-center gap-1">
              <p className="font-black text-slate-900 text-[17px]">{s.v}</p>
              {s.star && <Star size={12} fill="#f59e0b" className="text-amber-400" />}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-4">
        {[
          { icon: Truck, label: 'Riwayat Trip', sub: '91 trip tercatat', action: () => go('history') },
          { icon: Map, label: 'Rute Aktif', sub: '4 rute tersedia', action: () => go('route-select') },
          { icon: ShieldCheck, label: 'Keamanan & PIN', sub: 'Ubah PIN petugas', action: () => go('pin-verify') },
          { icon: Settings, label: 'Pengaturan', sub: 'Notifikasi & tampilan', action: () => { } },
        ].map((item, i) => (
          <button
            key={item.label}
            onClick={item.action}
            className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left ${i > 0 ? 'border-t border-slate-100' : ''}`}
          >
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <item.icon size={17} className="text-slate-600" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-slate-800">{item.label}</p>
              <p className="text-[10px] text-slate-400">{item.sub}</p>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </button>
        ))}
      </div>

      <button
        onClick={() => go('officer-switch')}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-red-100 text-red-500 font-bold text-[13px] hover:bg-red-50 transition-colors"
      >
        <LogOut size={16} /> Ganti Petugas
      </button>
    </div>
  )
}

// ─── Mobile App Container ─────────────────────────────────────────────────────
function MobileApp() {
  const [screen, setScreen] = useState<MobileScreen>('home')
  const noNavScreens: MobileScreen[] = ['camera', 'officer-switch', 'pin-verify', 'trip-active', 'trip-complete']
  const activeNav = ['history', 'history-detail'].includes(screen) ? 'history' : ['profile'].includes(screen) ? 'profile' : 'home'

  const screenMap: Record<MobileScreen, React.ReactNode> = {
    home: <HomeScreen go={setScreen} />,
    'route-select': <RouteSelectScreen go={setScreen} />,
    'trip-condition': <TripConditionScreen go={setScreen} />,
    'vehicle-form': <VehicleFormScreen go={setScreen} />,
    camera: <CameraScreen go={setScreen} />,
    'trip-summary': <TripSummaryScreen go={setScreen} />,
    'trip-active': <TripActiveScreen go={setScreen} />,
    'trip-complete': <TripCompleteScreen go={setScreen} />,
    history: <HistoryScreen go={setScreen} />,
    'history-detail': <HistoryDetailScreen go={setScreen} />,
    'officer-switch': <OfficerSwitchScreen go={setScreen} />,
    'pin-verify': <PinVerifyScreen go={setScreen} />,
    profile: <ProfileScreen go={setScreen} />,
  }

  if (noNavScreens.includes(screen)) {
    return (
      <div className="w-[390px] h-[844px] bg-[#F1F5F9] rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.22)] overflow-hidden flex flex-col border border-slate-300/60" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.8)' }}>
        <StatusBar />
        <div className="flex-1 overflow-y-auto hide-scrollbar">{screenMap[screen]}</div>
      </div>
    )
  }

  return (
    <MobileShell activeNav={activeNav} onNav={setScreen}>
      {screenMap[screen]}
    </MobileShell>
  )
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<AdminTab>('overview')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterOfficer, setFilterOfficer] = useState('')
  const [editTariff, setEditTariff] = useState<typeof tariffData[0] | null>(null)
  const [showOfficerForm, setShowOfficerForm] = useState(false)
  const [selectedReport, setSelectedReport] = useState<typeof allTrips[0] | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const filteredTrips = allTrips.filter(t =>
    (!filterStatus || t.load === filterStatus) &&
    (!filterOfficer || t.officer === filterOfficer)
  )
  const totalRevenue = allTrips.reduce((s, t) => s + (parseInt(t.revenue.replace(/\D/g, '')) || 0), 0)

  const navItems: { key: AdminTab; label: string; Icon: React.ElementType }[] = [
    { key: 'overview', label: 'Overview', Icon: LayoutGrid },
    { key: 'tariff', label: 'Master Tarif', Icon: Table2 },
    { key: 'officers', label: 'Petugas & Wilayah', Icon: Users },
    { key: 'reports', label: 'Laporan & Ekspor', Icon: BarChart2 },
    { key: 'settings', label: 'Pengaturan', Icon: Settings },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-[#0F172A] min-h-screen flex flex-col shrink-0 fixed left-0 top-0 bottom-0">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Truck size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-black text-[13px] leading-tight">Trip Angkutan</p>
              <p className="text-slate-500 text-[10px]">Admin Dashboard</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSelectedReport(null); setEditTariff(null); setShowOfficerForm(false) }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left text-[13px] transition-all ${tab === key ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Icon size={16} strokeWidth={tab === key ? 2.5 : 1.8} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-1">
          <div className="flex items-center gap-3 px-3.5 py-2">
            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-[11px] font-black text-white">AD</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[12px] font-bold truncate">Admin Utama</p>
              <p className="text-slate-500 text-[10px]">Super Admin · BADAU</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all text-[12px] font-semibold"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 ml-60 overflow-auto bg-[#F1F5F9] min-h-screen">
        {/* Topbar */}
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-black text-slate-900 text-[17px]">
              {tab === 'overview' && 'Dashboard Overview'}
              {tab === 'tariff' && (editTariff ? 'Edit Golongan Tarif' : 'Master Tarif Kendaraan')}
              {tab === 'officers' && (showOfficerForm ? 'Tambah Petugas Baru' : 'Manajemen Petugas & Wilayah')}
              {tab === 'reports' && (selectedReport ? 'Detail Trip' : 'Laporan & Ekspor Data')}
              {tab === 'settings' && 'Pengaturan Sistem'}
            </h1>
            <p className="text-slate-400 text-[11px] mt-0.5">Senin, 21 September 2026 · Region: BADAU</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
              <Bell size={16} className="text-slate-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full text-[8px] text-white flex items-center justify-center font-black">3</span>
            </div>
          </div>
        </div>

        <div className="p-8">

          {/* ─ Overview ─ */}
          {tab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total Trip', val: allTrips.length.toString(), sub: 'Semua waktu', color: 'blue', Icon: Truck },
                  { label: 'Trip Hari Ini', val: '3', sub: '↑ +1 dari kemarin', color: 'emerald', Icon: BarChart2 },
                  { label: 'Kendaraan Hari Ini', val: '5', sub: '2 jenis berbeda', color: 'amber', Icon: LayoutGrid },
                  { label: 'Pendapatan Bulan Ini', val: `Rp ${(totalRevenue / 1000).toFixed(0)}rb`, sub: 'September 2026', color: 'slate', Icon: Download },
                ].map(({ label, val, sub, color, Icon }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color === 'blue' ? 'bg-blue-100' : color === 'emerald' ? 'bg-emerald-100' : color === 'amber' ? 'bg-amber-100' : 'bg-slate-100'}`}>
                      <Icon size={18} className={color === 'blue' ? 'text-blue-600' : color === 'emerald' ? 'text-emerald-600' : color === 'amber' ? 'text-amber-600' : 'text-slate-600'} />
                    </div>
                    <p className="text-slate-500 text-[11px] font-medium mb-0.5">{label}</p>
                    <p className="text-slate-900 font-black text-[24px]">{val}</p>
                    <p className="text-slate-400 text-[11px] mt-1">{sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-slate-800">Trip per Hari (Sep 2026)</h3>
                    <span className="text-[11px] text-slate-400 font-medium">Minggu ini</span>
                  </div>
                  <div className="flex items-end gap-2 h-32">
                    {[2, 4, 3, 5, 3, 4, 3].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <div className="w-full rounded-t-lg bg-blue-500 hover:bg-blue-600 transition-colors" style={{ height: `${v / 5 * 100}%` }} />
                        <span className="text-[9px] text-slate-400 font-medium">{['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <h3 className="font-bold text-slate-800 mb-4">Distribusi Muatan</h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-28 h-28">
                      <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="67 33" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[17px] font-black text-slate-900">67%</span>
                        <span className="text-[9px] text-slate-400">Muatan</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[12px]"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />Ada Muatan</span><span className="font-bold">67%</span></div>
                    <div className="flex justify-between text-[12px]"><span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />Kosong</span><span className="font-bold">33%</span></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Trip Terbaru</h3>
                  <button onClick={() => setTab('reports')} className="text-blue-600 text-[12px] font-bold hover:underline flex items-center gap-1">Lihat Semua <ArrowRight size={13} /></button>
                </div>
                <table className="w-full">
                  <thead><tr className="bg-slate-50/70">{['ID Trip', 'Rute', 'Petugas', 'Kendaraan', 'Status', 'Pendapatan'].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {allTrips.slice(0, 5).map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => { setSelectedReport(t); setTab('reports') }}>
                        <td className="px-6 py-3.5 font-mono text-[11px] text-slate-400">{t.id}</td>
                        <td className="px-6 py-3.5 text-[13px] font-bold text-slate-800">{t.route}</td>
                        <td className="px-6 py-3.5 text-[13px] text-slate-600">{t.officer}</td>
                        <td className="px-6 py-3.5 text-[13px] text-slate-600">{t.type}</td>
                        <td className="px-6 py-3.5"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${t.load === 'Ada Muatan' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{t.load}</span></td>
                        <td className="px-6 py-3.5 text-[13px] font-black text-slate-900">{t.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─ Tariff ─ */}
          {tab === 'tariff' && !editTariff && (
            <div className="animate-fade-in space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Golongan', val: tariffData.length.toString(), color: 'blue' },
                  { label: 'Tarif Tertinggi', val: 'Rp 450.000', color: 'emerald' },
                  { label: 'Tarif Terendah', val: 'Rp 8.000', color: 'slate' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-[11px] mb-0.5">{label}</p>
                    <p className={`font-black text-[24px] ${color === 'blue' ? 'text-blue-600' : color === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`}>{val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">Tabel Tarif Kendaraan</h3>
                  <button onClick={() => setEditTariff({ golongan: 'VI', type: '', loaded: '', loadedNum: 0, empty: '', emptyNum: 0, desc: '' })} className="flex items-center gap-2 bg-blue-600 text-white text-[12px] font-bold px-4 py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/20">
                    <Plus size={14} /> Tambah Golongan
                  </button>
                </div>
                <table className="w-full">
                  <thead><tr className="bg-slate-50/70">{['Gol.', 'Jenis Kendaraan', 'Deskripsi', 'Tarif Muatan', 'Tarif Kosong', 'Aksi'].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {tariffData.map(row => (
                      <tr key={row.golongan} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4"><span className="w-8 h-8 rounded-lg bg-slate-100 font-mono font-black text-[13px] flex items-center justify-center text-slate-700">{row.golongan}</span></td>
                        <td className="px-6 py-4 text-[13px] font-bold text-slate-800">{row.type}</td>
                        <td className="px-6 py-4 text-[12px] text-slate-500">{row.desc}</td>
                        <td className="px-6 py-4 text-[13px] font-bold text-emerald-700">{row.loaded}</td>
                        <td className="px-6 py-4 text-[13px] text-slate-500">{row.empty}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button onClick={() => setEditTariff(row)} className="text-[12px] text-blue-600 font-bold hover:underline flex items-center gap-1"><Pencil size={12} />Edit</button>
                            <button className="text-[12px] text-red-500 font-bold hover:underline flex items-center gap-1"><Trash2 size={12} />Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'tariff' && editTariff && (
            <div className="animate-fade-in max-w-xl">
              <button onClick={() => setEditTariff(null)} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-6 hover:text-slate-700 font-medium">
                <ChevronLeft size={16} /> Kembali ke Tabel Tarif
              </button>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Golongan</label><input defaultValue={editTariff.golongan} className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] font-mono font-bold focus:outline-none focus:border-blue-500 transition-colors" /></div>
                  <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Jenis Kendaraan</label><input defaultValue={editTariff.type} placeholder="cth: Truck Besar" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500 transition-colors" /></div>
                </div>
                <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Deskripsi</label><input defaultValue={editTariff.desc} className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500 transition-colors" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Tarif Muatan (Rp)</label><input defaultValue={editTariff.loadedNum || ''} type="number" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500 transition-colors" /></div>
                  <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Tarif Kosong (Rp)</label><input defaultValue={editTariff.emptyNum || ''} type="number" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500 transition-colors" /></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setEditTariff(null)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-50">Batal</button>
                  <button onClick={() => setEditTariff(null)} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-[13px] hover:bg-blue-700">Simpan Perubahan</button>
                </div>
              </div>
            </div>
          )}

          {/* ─ Officers ─ */}
          {tab === 'officers' && !showOfficerForm && (
            <div className="animate-fade-in space-y-5">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Total Petugas', val: '5', color: 'blue' },
                  { label: 'Aktif Hari Ini', val: '4', color: 'emerald' },
                  { label: 'Nonaktif', val: '1', color: 'slate' },
                  { label: 'Total Wilayah', val: '2', color: 'amber' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p className="text-slate-400 text-[11px] mb-0.5">{label}</p>
                    <p className={`font-black text-[24px] ${color === 'blue' ? 'text-blue-600' : color === 'emerald' ? 'text-emerald-600' : color === 'amber' ? 'text-amber-600' : 'text-slate-900'}`}>{val}</p>
                  </div>
                ))}
              </div>

              {['BADAU', 'ENTIKONG'].map(region => (
                <div key={region} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-4 bg-[#0F172A] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock size={15} className="text-amber-400" />
                      <span className="text-white font-bold text-[14px]">Wilayah {region}</span>
                      <span className="text-slate-500 text-[12px]">· {officerList.filter(o => o.region === region).length} petugas</span>
                    </div>
                    <button onClick={() => setShowOfficerForm(true)} className="flex items-center gap-1.5 bg-blue-600 text-white text-[11px] font-bold px-3 py-2 rounded-lg hover:bg-blue-500 transition-colors">
                      <Plus size={13} /> Tambah
                    </button>
                  </div>
                  <table className="w-full">
                    <thead><tr className="bg-slate-50/70">{['Petugas', 'PIN', 'Perangkat', 'Trip Total', 'Terakhir Aktif', 'Status', 'Aksi'].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-slate-50">
                      {officerList.filter(o => o.region === region).map(o => (
                        <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-[12px] ${o.status === 'Aktif' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{o.initials}</div>
                              <div><p className="text-[13px] font-bold text-slate-800">{o.name}</p><p className="text-[10px] text-slate-400">Bergabung {o.joined}</p></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-[13px] text-slate-400">{o.pin}</td>
                          <td className="px-6 py-4 text-[13px] text-slate-500">{o.device}</td>
                          <td className="px-6 py-4 text-[13px] font-black text-slate-800">{o.trips}</td>
                          <td className="px-6 py-4 text-[12px] text-slate-500">{o.lastActive}</td>
                          <td className="px-6 py-4"><span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${o.status === 'Aktif' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{o.status}</span></td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 text-[12px]">
                              <button className="text-blue-600 font-bold hover:underline">Edit PIN</button>
                              <span className="text-slate-200">|</span>
                              <button className={`font-bold hover:underline ${o.status === 'Aktif' ? 'text-amber-500' : 'text-emerald-600'}`}>{o.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          {tab === 'officers' && showOfficerForm && (
            <div className="animate-fade-in max-w-xl">
              <button onClick={() => setShowOfficerForm(false)} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-6 hover:text-slate-700 font-medium">
                <ChevronLeft size={16} /> Kembali ke Daftar Petugas
              </button>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Nama Lengkap</label><input placeholder="Nama petugas" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500 transition-colors" /></div>
                  <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Wilayah</label>
                    <select className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500 transition-colors">
                      <option>BADAU</option><option>ENTIKONG</option>
                    </select>
                  </div>
                </div>
                <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">PIN (6 digit)</label><input type="password" maxLength={6} placeholder="••••••" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] font-mono tracking-widest focus:outline-none focus:border-blue-500 transition-colors" /></div>
                <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Konfirmasi PIN</label><input type="password" maxLength={6} placeholder="••••••" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] font-mono tracking-widest focus:outline-none focus:border-blue-500 transition-colors" /></div>
                <div><label className="text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wide">Perangkat (opsional)</label><input placeholder="cth: Samsung A54" className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-blue-500 transition-colors" /></div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <Lock size={15} className="text-amber-500 mt-0.5 shrink-0" />
                  <div><p className="text-[12px] font-black text-amber-700 mb-0.5">Region Lock Aktif</p><p className="text-[11px] text-amber-600">Petugas ini hanya dapat login pada perangkat yang terdaftar di wilayahnya.</p></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowOfficerForm(false)} className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold text-[13px] hover:bg-slate-50">Batal</button>
                  <button onClick={() => setShowOfficerForm(false)} className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-[13px] hover:bg-blue-700">Simpan Petugas</button>
                </div>
              </div>
            </div>
          )}

          {/* ─ Reports ─ */}
          {tab === 'reports' && !selectedReport && (
            <div className="animate-fade-in space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Trip', val: allTrips.length.toString(), sub: 'Semua data' },
                  { label: 'Ada Muatan', val: allTrips.filter(t => t.load === 'Ada Muatan').length.toString(), sub: 'trip bermuatan' },
                  { label: 'Total Pendapatan', val: `Rp ${(totalRevenue / 1000).toFixed(0)}rb`, sub: 'akumulasi' },
                ].map(({ label, val, sub }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-[11px] mb-0.5">{label}</p>
                    <p className="text-slate-900 font-black text-[24px]">{val}</p>
                    <p className="text-slate-400 text-[11px] mt-1">{sub}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Status</label>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 focus:outline-none focus:border-blue-500 transition-colors">
                    <option value="">Semua</option><option value="Ada Muatan">Ada Muatan</option><option value="Kosong">Kosong</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Petugas</label>
                  <select value={filterOfficer} onChange={e => setFilterOfficer(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-700 focus:outline-none focus:border-blue-500 transition-colors">
                    <option value="">Semua</option>
                    {[...new Set(allTrips.map(t => t.officer))].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="ml-auto flex gap-2">
                  <button onClick={() => { setFilterStatus(''); setFilterOfficer('') }} className="text-[12px] text-slate-500 font-semibold px-3 py-2 rounded-lg hover:bg-slate-50 border border-slate-200">Reset</button>
                  <button className="flex items-center gap-2 bg-emerald-600 text-white text-[12px] font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-sm">
                    <Download size={13} /> Ekspor Excel
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">Data Trip <span className="text-slate-400 font-normal text-[13px]">({filteredTrips.length} hasil)</span></h3>
                </div>
                <table className="w-full">
                  <thead><tr className="bg-slate-50/70">{['ID Trip', 'Tanggal', 'Rute', 'Petugas', 'Kendaraan', 'Status', 'Pendapatan', ''].map(h => <th key={h} className="text-left px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTrips.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedReport(t)}>
                        <td className="px-6 py-3.5 font-mono text-[11px] text-slate-400">{t.id}</td>
                        <td className="px-6 py-3.5 text-[12px] text-slate-500">{t.date} {t.time}</td>
                        <td className="px-6 py-3.5 text-[13px] font-bold text-slate-800">{t.route}</td>
                        <td className="px-6 py-3.5 text-[13px] text-slate-600">{t.officer}</td>
                        <td className="px-6 py-3.5 text-[13px] text-slate-600">{t.type}</td>
                        <td className="px-6 py-3.5"><span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${t.load === 'Ada Muatan' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{t.load}</span></td>
                        <td className="px-6 py-3.5 text-[13px] font-black text-slate-900">{t.revenue}</td>
                        <td className="px-6 py-3.5"><button className="text-[12px] text-blue-600 font-bold hover:underline">Detail →</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTrips.length === 0 && <div className="py-12 text-center text-slate-400 text-[13px]">Tidak ada data yang sesuai filter</div>}
              </div>
            </div>
          )}

          {tab === 'reports' && selectedReport && (
            <div className="animate-fade-in max-w-2xl">
              <button onClick={() => setSelectedReport(null)} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-6 hover:text-slate-700 font-medium">
                <ChevronLeft size={16} /> Kembali ke Laporan
              </button>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="font-mono text-[12px] text-slate-400">{selectedReport.id}</p>
                  <h2 className="font-black text-slate-900 text-[22px]">{selectedReport.route}</h2>
                </div>
                <span className="font-black text-emerald-700 bg-emerald-100 px-4 py-2 rounded-xl text-[13px]">{selectedReport.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-[#0F172A] rounded-2xl p-5">
                  <p className="text-slate-400 text-[11px] mb-3 uppercase tracking-wide font-bold">Info Trip</p>
                  <div className="space-y-2.5">
                    {[['Tanggal', selectedReport.date], ['Jam', selectedReport.time], ['Durasi', selectedReport.duration], ['Petugas', selectedReport.officer]].map(([k, v]) => (
                      <div key={k} className="flex justify-between"><span className="text-slate-500 text-[12px]">{k}</span><span className="text-white text-[12px] font-semibold">{v}</span></div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <p className="text-slate-400 text-[11px] mb-3 uppercase tracking-wide font-bold">Info Kendaraan</p>
                  <div className="space-y-2.5">
                    {[['No. Polisi', selectedReport.vehicle], ['Jenis', selectedReport.type], ['Kategori', selectedReport.category], ['Status', selectedReport.load]].map(([k, v]) => (
                      <div key={k} className="flex justify-between"><span className="text-slate-400 text-[12px]">{k}</span><span className="text-slate-800 text-[12px] font-bold">{v}</span></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-4 flex justify-between items-center">
                <p className="text-slate-500 text-[13px]">Total Pendapatan Trip</p>
                <p className="text-[24px] font-black text-slate-900">{selectedReport.revenue}</p>
              </div>
              {selectedReport.photo && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <p className="text-[11px] font-black text-slate-500 mb-3 uppercase tracking-wide">Foto Bukti Muatan</p>
                  <div className="bg-slate-100 rounded-xl h-40 flex items-center justify-center">
                    <div className="text-center"><Camera size={36} className="text-slate-300 mx-auto" /><p className="text-[12px] text-slate-400 mt-2">Foto tersimpan di server</p></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─ Settings ─ */}
          {tab === 'settings' && (
            <div className="animate-fade-in max-w-2xl space-y-5">
              {[
                {
                  title: 'Pengaturan Wilayah',
                  items: [
                    { label: 'Wilayah Aktif', desc: 'Region saat ini yang terdaftar', type: 'text', val: 'BADAU' },
                    { label: 'Multi-Region', desc: 'Izinkan petugas lintas wilayah', type: 'toggle', val: false },
                    { label: 'GPS Fence Radius', desc: 'Radius batas wilayah (km)', type: 'number', val: '25' },
                  ]
                },
                {
                  title: 'Pengaturan Trip',
                  items: [
                    { label: 'Auto-sync Data', desc: 'Sinkronisasi otomatis saat koneksi tersedia', type: 'toggle', val: true },
                    { label: 'Wajib Foto Bukti', desc: 'Petugas wajib foto untuk trip bermuatan', type: 'toggle', val: true },
                    { label: 'Tambah Kendaraan Maks.', desc: 'Jumlah maks. kendaraan per trip', type: 'number', val: '5' },
                  ]
                },
                {
                  title: 'Keamanan',
                  items: [
                    { label: 'PIN Expiry', desc: 'Masa berlaku PIN (hari, 0 = tidak kedaluwarsa)', type: 'number', val: '90' },
                    { label: 'Auto-logout', desc: 'Logout otomatis setelah tidak aktif (menit)', type: 'number', val: '30' },
                    { label: 'Device Lock', desc: 'Kunci akun ke satu perangkat saja', type: 'toggle', val: true },
                  ]
                },
              ].map(section => (
                <div key={section.title} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                    <h3 className="font-black text-slate-700 text-[13px] uppercase tracking-wide">{section.title}</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {section.items.map(item => (
                      <div key={item.label} className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <p className="text-[13px] font-semibold text-slate-800">{item.label}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                        {item.type === 'toggle' ? (
                          <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${item.val ? 'bg-blue-600' : 'bg-slate-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${item.val ? 'left-6' : 'left-1'}`} />
                          </div>
                        ) : item.type === 'number' ? (
                          <input defaultValue={item.val as string} type="number" className="w-20 text-right border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] focus:outline-none focus:border-blue-500 font-mono" />
                        ) : (
                          <input defaultValue={item.val as string} className="border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] focus:outline-none focus:border-blue-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button className="bg-blue-600 text-white font-black px-8 py-3.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all text-[13px] shadow-sm shadow-blue-600/20">Simpan Semua Pengaturan</button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setError(false)
    if (username === 'admin' && password === 'admin123') {
      setLoading(true)
      setTimeout(onLogin, 800)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-800/8 blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative w-full max-w-md px-5">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-[22px] bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/30 mb-4">
            <Truck size={30} className="text-white" />
          </div>
          <h1 className="text-white font-black text-[26px] tracking-tight">Trip Angkutan</h1>
          <p className="text-slate-500 text-[13px] mt-1 font-medium">Sistem Manajemen Angkutan</p>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-white font-black text-[18px] mb-0.5">Masuk ke Sistem</h2>
          <p className="text-slate-500 text-[12px] mb-6 font-medium">Gunakan akun yang diberikan administrator</p>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-black text-slate-500 mb-2 block uppercase tracking-wider">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Masukkan username"
                  className={`w-full bg-[#0F172A] border-2 rounded-xl pl-11 pr-4 py-3.5 text-[13px] text-white placeholder:text-slate-600 focus:outline-none transition-colors ${error ? 'border-red-500/50' : 'border-slate-700 focus:border-blue-500'}`}
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-500 mb-2 block uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Masukkan password"
                  className={`w-full bg-[#0F172A] border-2 rounded-xl pl-11 pr-12 py-3.5 text-[13px] text-white placeholder:text-slate-600 focus:outline-none transition-colors ${error ? 'border-red-500/50' : 'border-slate-700 focus:border-blue-500'}`}
                />
                <button onClick={() => setShowPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fade-in">
                <AlertCircle size={15} className="text-red-400 shrink-0" />
                <p className="text-red-400 text-[12px] font-medium">Username atau password salah. Coba lagi.</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={!username || !password || loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl text-[14px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Memverifikasi...</>
              ) : (
                <>Masuk <ArrowRight size={16} /></>
              )}
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-slate-600 text-[11px] font-semibold text-center mb-3 uppercase tracking-wide">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2">
              {[['Username', 'admin'], ['Password', 'admin123']].map(([label, val]) => (
                <button
                  key={label}
                  onClick={() => { if (label === 'Username') setUsername(val); else setPassword(val) }}
                  className="bg-[#0F172A] rounded-xl px-3.5 py-2.5 text-left hover:bg-slate-800 transition-colors border border-slate-800 hover:border-slate-700"
                >
                  <p className="text-slate-600 text-[9px] font-black uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-slate-300 text-[12px] font-mono font-bold">{val}</p>
                </button>
              ))}
            </div>
            <p className="text-slate-700 text-[10px] text-center mt-3">Klik pada credential di atas untuk auto-fill</p>
          </div>
        </div>

        <p className="text-slate-700 text-[11px] text-center mt-5 font-medium">
          Wilayah BADAU · Kalimantan Barat · v2.4.1
        </p>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [mode, setMode] = useState<AppMode>('mobile')

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />

  return (
    <div className="min-h-screen bg-slate-200 font-sans">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-lg p-1.5 flex gap-1 border border-slate-100">
        {([['mobile', '📱  Mobile App'], ['admin', '🖥️  Admin Dashboard']] as [AppMode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => setMode(m)} className={`px-5 py-2 rounded-xl text-[12px] font-bold transition-all ${mode === m ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>{label}</button>
        ))}
        <button onClick={() => setLoggedIn(false)} className="px-4 py-2 rounded-xl text-[12px] font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all ml-1 flex items-center gap-1.5">
          <LogOut size={13} /> Logout
        </button>
      </div>

      {mode === 'mobile' ? (
        <div className="flex items-start justify-center min-h-screen pt-20 pb-10">
          <MobileApp />
        </div>
      ) : (
        <div className="min-h-screen pt-16">
          <AdminDashboard onLogout={() => setLoggedIn(false)} />
        </div>
      )}
    </div>
  )
}
