import { Truck, Map, ShieldCheck, Settings, ChevronRight, Star, LogOut } from 'lucide-react'
import type { MobileScreen } from '../types'

// ─── Profile Screen ────────────────────────────────────────────────────────────
interface ProfileScreenProps {
  go: (s: MobileScreen) => void
}

export default function ProfileScreen({ go }: ProfileScreenProps) {
  return (
    <div className="px-4 pt-2 pb-4 animate-fade-in">
      <h2 className="font-black text-slate-900 text-[20px] mb-4">Profil Saya</h2>

      {/* Profile Card */}
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

      {/* Stats */}
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

      {/* Menu */}
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
