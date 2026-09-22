import { useState } from 'react'
import { Truck, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'

// ─── Login Page ───────────────────────────────────────────────────────────────
interface LoginPageProps {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setError(false)
    if (username === 'admin' && password === 'admin123') {
      setLoading(true)
      setTimeout(onLogin, 800)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-800/8 blur-3xl" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative w-full max-w-md px-5">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-[22px] bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/30 mb-4">
            <Truck size={30} className="text-white" />
          </div>
          <h1 className="text-white font-black text-[26px] tracking-tight">Trip Angkutan</h1>
          <p className="text-slate-500 text-[13px] mt-1 font-medium">Sistem Manajemen Angkutan</p>
        </div>

        {/* Card */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-white font-black text-[18px] mb-0.5">Masuk ke Sistem</h2>
          <p className="text-slate-500 text-[12px] mb-6 font-medium">Gunakan akun yang diberikan administrator</p>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-black text-slate-500 mb-2 block uppercase tracking-wider">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Masukkan username"
                  className={`w-full bg-[#0F172A] border-2 rounded-xl pl-11 pr-4 py-3.5 text-[13px] text-white placeholder:text-slate-600 focus:outline-none transition-colors ${error ? 'border-red-500/50' : 'border-slate-700 focus:border-blue-500'}`}
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-500 mb-2 block uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Masukkan password"
                  className={`w-full bg-[#0F172A] border-2 rounded-xl pl-11 pr-12 py-3.5 text-[13px] text-white placeholder:text-slate-600 focus:outline-none transition-colors ${error ? 'border-red-500/50' : 'border-slate-700 focus:border-blue-500'}`}
                />
                <button onClick={() => setShowPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fade-in">
                <AlertCircle size={15} className="text-red-400 shrink-0" />
                <p className="text-red-400 text-[12px] font-medium">Username atau password salah. Coba lagi.</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={!username || !password || loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl text-[14px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Memverifikasi...</>
              ) : (
                <>Masuk <ArrowRight size={16} /></>
              )}
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-slate-600 text-[11px] font-semibold text-center mb-3 uppercase tracking-wide">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2">
              {[['Username', 'admin'], ['Password', 'admin123']].map(([label, val]) => (
                <button
                  key={label}
                  onClick={() => { if (label === 'Username') setUsername(val); else setPassword(val) }}
                  className="bg-[#0F172A] rounded-xl px-3.5 py-2.5 text-left hover:bg-slate-800 transition-colors border border-slate-800 hover:border-slate-700"
                >
                  <p className="text-slate-600 text-[9px] font-black uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-slate-300 text-[12px] font-mono font-bold">{val}</p>
                </button>
              ))}
            </div>
            <p className="text-slate-700 text-[10px] text-center mt-3">Klik pada credential di atas untuk auto-fill</p>
          </div>
        </div>

        <p className="text-slate-700 text-[11px] text-center mt-5 font-medium">
          Wilayah BADAU · Kalimantan Barat · v2.4.1
        </p>
      </div>
    </div>
  )
}
