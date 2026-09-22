import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import type { MobileScreen } from '../types'

// ─── Trip Condition Screen ─────────────────────────────────────────────────────
interface TripConditionScreenProps {
  go: (s: MobileScreen) => void
}

export default function TripConditionScreen({ go }: TripConditionScreenProps) {
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
