import { ChevronLeft, Lock } from 'lucide-react'
import { officerList } from '../data'
import type { MobileScreen } from '../types'

// ─── Officer Switch Screen ─────────────────────────────────────────────────────
interface OfficerSwitchScreenProps {
  go: (s: MobileScreen) => void
}

export default function OfficerSwitchScreen({ go }: OfficerSwitchScreenProps) {
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
        <p className="text-slate-400 text-[12px]">
          Hanya petugas wilayah <span className="text-emerald-400 font-black">BADAU</span> yang ditampilkan
        </p>
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
