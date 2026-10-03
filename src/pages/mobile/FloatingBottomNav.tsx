import { Home, List, User } from 'lucide-react'
import type { ElementType } from 'react'

export interface FloatingBottomNavProps {
  activeScreen: string
  onNavigate: (screen: string) => void
}

interface NavItem {
  id: string
  label: string
  icon: ElementType
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'history', label: 'Riwayat', icon: List },
  { id: 'profile', label: 'Profil', icon: User },
]

export default function FloatingBottomNav({ activeScreen, onNavigate }: FloatingBottomNavProps) {
  return (
    <div className="shrink-0 px-4 pb-7 pt-2">
      <nav className="bg-white rounded-2xl shadow-lg border border-slate-100 flex justify-around items-center py-3 px-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeScreen === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center gap-1 px-6 py-1.5 rounded-2xl transition-all active:scale-95 ${
                isActive ? 'text-blue-600 font-semibold bg-blue-50' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px]">{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
