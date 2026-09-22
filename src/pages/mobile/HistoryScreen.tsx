import { useState } from 'react'
import { Truck } from 'lucide-react'
import { allTrips } from '../data'
import type { MobileScreen } from '../types'

// ─── History Screen ────────────────────────────────────────────────────────────
interface HistoryScreenProps {
  go: (s: MobileScreen) => void
}

export default function HistoryScreen({ go }: HistoryScreenProps) {
  const [filter, setFilter] = useState<'all' | 'muatan' | 'kosong'>('all')

  const filtered = filter === 'all'
    ? allTrips
    : allTrips.filter(t => filter === 'muatan' ? t.load === 'Ada Muatan' : t.load === 'Kosong')

  return (
    <div className="px-4 pt-2 pb-4 animate-fade-in">
      <h2 className="font-black text-slate-900 text-[20px] mb-3">Riwayat Trip</h2>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {([['all', 'Semua'], ['muatan', 'Muatan'], ['kosong', 'Kosong']] as [typeof filter, string][]).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-4 py-1.5 rounded-xl text-[12px] font-bold transition-all ${filter === k ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'}`}
          >{l}</button>
        ))}
      </div>

      {/* List */}
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
