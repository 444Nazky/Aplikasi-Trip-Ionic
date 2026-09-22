import MobileApp from './pages/mobile/MobileApp'
import LoginPage from './pages/LoginPage'
import { AppProvider, useApp } from './pages/store'

function Shell() {
  const { loggedIn, login } = useApp()

  if (!loggedIn) return <LoginPage onLogin={login} />

  return (
    <div className="min-h-screen bg-slate-200 font-sans flex items-center justify-center">
      <MobileApp />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
