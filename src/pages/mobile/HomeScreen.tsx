import { Truck, ArrowLeftRight, ChevronRight, ArrowRight } from 'lucide-react'
import { allTrips } from '../data'
import type { MobileScreen } from '../types'

// ─── Home Screen ──────────────────────────────────────────────────────────────
interface HomeScreenProps {
  go: (s: MobileScreen) => void
}

export default function HomeScreen({ go }: HomeScreenProps) {
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

      {/* Recent Trips */}
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
