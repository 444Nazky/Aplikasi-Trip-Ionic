import { ChevronLeft, Truck, Play } from 'lucide-react'
import type { MobileScreen } from '../types'

// ─── Trip Summary Screen ───────────────────────────────────────────────────────
interface TripSummaryScreenProps {
  go: (s: MobileScreen) => void
}

export default function TripSummaryScreen({ go }: TripSummaryScreenProps) {
  return (
    <div className="px-4 pt-2 pb-4 animate-fade-in">
      <button onClick={() => go('vehicle-form')} className="flex items-center gap-1.5 text-slate-500 text-[13px] mb-4 hover:text-slate-700 font-medium">
        <ChevronLeft size={16} /> Kembali
      </button>
      <h2 className="font-black text-slate-900 text-[20px] mb-0.5">Ringkasan Trip</h2>
      <p className="text-slate-500 text-[13px] mb-4">Periksa data sebelum memulai trip</p>

      {/* Trip Header Card */}
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

      {/* Kendaraan */}
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
