import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import MobileApp from './pages/mobile/MobileApp'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(true)

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />

  return (
    <div className="min-h-screen bg-slate-200 font-sans flex items-center justify-center">
      <MobileApp />
    </div>
  )
}
