import { ChevronLeft, RefreshCw, Camera } from 'lucide-react'
import { useApp } from '../store'
import type { MobileScreen } from '../types'

// ─── Camera Screen ─────────────────────────────────────────────────────────────
interface CameraScreenProps {
  go: (s: MobileScreen) => void
}

export default function CameraScreen({ go }: CameraScreenProps) {
  const { patchDraft } = useApp()

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="relative bg-slate-950 flex-1 flex items-center justify-center" style={{ minHeight: 560 }}>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/40" />

        {/* Header */}
        <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
          <button onClick={() => go('vehicle-form')} className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 text-white">
            <ChevronLeft size={20} />
          </button>
          <div className="bg-black/50 rounded-full px-4 py-2">
            <span className="text-white text-[12px] font-semibold">Foto Bukti Muatan</span>
          </div>
          <div className="w-10" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-8 grid grid-cols-3 grid-rows-3 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => <div key={i} className="border border-white/10" />)}
        </div>

        {/* Viewfinder */}
        <div className="relative w-64 h-64">
          {([
            ['top-0 left-0', 'border-t-2 border-l-2 rounded-tl-2xl'],
            ['top-0 right-0', 'border-t-2 border-r-2 rounded-tr-2xl'],
            ['bottom-0 left-0', 'border-b-2 border-l-2 rounded-bl-2xl'],
            ['bottom-0 right-0', 'border-b-2 border-r-2 rounded-br-2xl'],
          ] as [string, string][]).map(([pos, border], i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8 border-white ${border}`} />
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Camera size={40} className="text-white/30" />
            <span className="text-white/40 text-[11px] text-center px-8">Arahkan ke selfie + muatan kendaraan</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-950 flex items-center justify-center py-8 gap-12">
        <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
          <RefreshCw size={18} />
        </button>
        <button onClick={() => { patchDraft({ photo: true }); go('vehicle-form') }} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform">
          <div className="w-14 h-14 rounded-full bg-white" />
        </button>
        <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center">
          <span className="text-slate-600 text-[10px]">—</span>
        </div>
      </div>
    </div>
  )
}
