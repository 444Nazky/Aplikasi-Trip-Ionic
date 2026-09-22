import { Check } from 'lucide-react'
import type { MobileScreen } from '../types'

// ─── Trip Complete Screen ──────────────────────────────────────────────────────
interface TripCompleteScreenProps {
  go: (s: MobileScreen) => void
}

export default function TripCompleteScreen({ go }: TripCompleteScreenProps) {
  return (
    <div className="px-4 pt-6 pb-4 flex flex-col items-center animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-emerald-100 flex items-center justify-center mb-4">
        <Check size={38} className="text-emerald-500" strokeWidth={3} />
      </div>
      <h2 className="font-black text-slate-900 text-[24px] mb-1 text-center">Trip Selesai!</h2>
      <p className="text-slate-500 text-[13px] text-center mb-5">Trip TRP-2026-0092 berhasil dicatat dan disimpan</p>

      {/* Summary */}
      <div className="w-full bg-[#0F172A] rounded-3xl p-5 mb-4">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Rute', val: 'SJRE → SBDZ' },
            { label: 'Durasi', val: '1j 09m' },
            { label: 'Kendaraan', val: '2 unit' },
            { label: 'Total Tarif', val: 'Rp 325.000' },
          ].map(({ label, val }) => (
            <div key={label}>
              <p className="text-slate-500 text-[10px] mb-0.5">{label}</p>
              <p className="text-white font-bold text-[13px]">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sync status */}
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
