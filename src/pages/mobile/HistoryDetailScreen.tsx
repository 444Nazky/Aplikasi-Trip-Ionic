import { ChevronLeft, Camera, Check } from 'lucide-react'
import { allTrips } from '../data'
import type { MobileScreen } from '../types'

// ─── History Detail Screen ─────────────────────────────────────────────────────
interface HistoryDetailScreenProps {
  go: (s: MobileScreen) => void
}

export default function HistoryDetailScreen({ go }: HistoryDetailScreenProps) {
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

      {/* Info Card */}
      <div className="bg-[#0F172A] rounded-3xl p-5 mb-4">
        <div className="grid grid-cols-2 gap-4">
          {[{ l: 'Tanggal', v: t.date }, { l: 'Jam Mulai', v: t.time }, { l: 'Durasi', v: t.duration }, { l: 'Petugas', v: t.officer }].map(({ l, v }) => (
            <div key={l}><p className="text-slate-500 text-[10px] mb-0.5">{l}</p><p className="text-white font-semibold text-[12px]">{v}</p></div>
          ))}
        </div>
      </div>

      {/* Kendaraan */}
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

      {/* Foto */}
      {t.photo && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-3">
          <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wide">Foto Bukti</p>
          <div className="bg-slate-100 rounded-xl h-32 flex items-center justify-center">
            <div className="text-center"><Camera size={28} className="text-slate-300 mx-auto" /><p className="text-[10px] text-slate-400 mt-1">Foto tersimpan</p></div>
          </div>
        </div>
      )}

      {/* Sync */}
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
