import { Home, List, User } from 'lucide-react'
import StatusBar from './StatusBar'
import type { MobileScreen } from '../types'

// ─── Mobile Shell ─────────────────────────────────────────────────────────────
interface MobileShellProps {
  children: React.ReactNode
  activeNav: string
  onNav: (s: MobileScreen) => void
}

export default function MobileShell({ children, activeNav, onNav }: MobileShellProps) {
  return (
    <div
      className="w-[390px] h-[844px] bg-[#F1F5F9] rounded-[48px] overflow-hidden relative flex flex-col border border-slate-300/60"
      style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.8)' }}
    >
      <StatusBar />
      <div className="flex-1 overflow-y-auto hide-scrollbar">{children}</div>

      {/* Bottom Nav */}
      <div className="shrink-0 px-4 pb-7 pt-2 bg-[#F1F5F9]">
        <div className="bg-white rounded-[22px] shadow-[0_4px_20px_rgba(0,0,0,0.10)] flex justify-around items-center py-3 px-2 border border-slate-100">
          {([
            ['home', 'Beranda', Home],
            ['history', 'Riwayat', List],
            ['profile', 'Profil', User],
          ] as [MobileScreen, string, React.ElementType][]).map(([s, label, Icon]) => (
            <button
              key={s}
              onClick={() => onNav(s)}
              className={`flex flex-col items-center gap-1 px-6 py-1.5 rounded-2xl transition-all ${activeNav === s ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Icon size={20} strokeWidth={activeNav === s ? 2.5 : 1.8} />
              <span className={`text-[10px] font-semibold ${activeNav === s ? 'font-bold' : ''}`}>{label}</span>
              {activeNav === s && <div className="w-1 h-1 rounded-full bg-blue-600 -mt-0.5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
