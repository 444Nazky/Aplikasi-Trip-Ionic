import { useEffect, useState } from 'react'
import { Wifi, Battery, Signal } from 'lucide-react'
import { fmtClock } from '../store'

interface StatusBarProps {
  light?: boolean
}

export default function StatusBar({ light = false }: StatusBarProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])

  const c = light ? 'text-white' : 'text-slate-800'
  return (
    <div className={`flex justify-between items-center px-6 pt-4 pb-1 shrink-0 ${c}`}>
      <span className="text-[13px] font-bold tracking-tight">{fmtClock(now)}</span>
      <div className="flex gap-1.5 items-center">
        <Signal size={14} strokeWidth={2.5} />
        <Wifi size={14} strokeWidth={2.5} />
        <Battery size={16} strokeWidth={2.5} />
      </div>
    </div>
  )
}
