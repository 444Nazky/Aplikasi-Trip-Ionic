import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import MobileApp from './pages/mobile/MobileApp'
import AdminDashboard from './pages/admin/AdminDashboard'
import type { AppMode } from './pages/types'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [mode, setMode] = useState<AppMode>('mobile')

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />

  return (
    <div className="min-h-screen bg-slate-200 font-sans">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-2xl shadow-lg p-1.5 flex gap-1 border border-slate-100">
        {([['mobile', '📱  Mobile App'], ['admin', '🖥️  Admin Dashboard']] as [AppMode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => setMode(m)} className={`px-5 py-2 rounded-xl text-[12px] font-bold transition-all ${mode === m ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>{label}</button>
        ))}
        <button onClick={() => setLoggedIn(false)} className="px-4 py-2 rounded-xl text-[12px] font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all ml-1 flex items-center gap-1.5">
          Logout
        </button>
      </div>

      {mode === 'mobile' ? (
        <div className="flex items-start justify-center min-h-screen pt-20 pb-10">
          <MobileApp />
        </div>
      ) : (
        <div className="min-h-screen pt-16">
          <AdminDashboard onLogout={() => setLoggedIn(false)} />
        </div>
      )}
    </div>
  )
}
