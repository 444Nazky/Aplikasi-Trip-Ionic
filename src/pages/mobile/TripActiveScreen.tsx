import { Square } from 'lucide-react'
import type { MobileScreen } from '../types'

// ─── Trip Active Screen ────────────────────────────────────────────────────────
interface TripActiveScreenProps {
  go: (s: MobileScreen) => void
}

export default function TripActiveScreen({ go }: TripActiveScreenProps) {
  return (
    <div className="px-4 pt-2 pb-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-black text-slate-900 text-[20px]">Trip Berlangsung</h2>
        <span className="text-[11px] font-bold bg-blue-100 text-blue-600 px-3 py-1 rounded-full flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> In Transit
        </span>
      </div>

      {/* Timer */}
      <div className="bg-[#0F172A] rounded-3xl p-6 mb-4 text-center">
        <p className="text-slate-400 text-[11px] mb-2 uppercase tracking-wide">Durasi Berjalan</p>
        <p className="text-white font-mono font-black text-[40px] tracking-widest mb-3">00:23:14</p>
        <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }} />
        </div>
        <p className="text-slate-500 text-[11px]">Estimasi tiba: ±47 menit lagi</p>
      </div>

      {/* Route */}
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

      {/* Kendaraan */}
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
