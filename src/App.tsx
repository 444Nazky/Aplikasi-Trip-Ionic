import MobileApp from './pages/mobile/MobileApp'
import AdminDashboard from './pages/admin/AdminDashboard'
import LoginPage from './pages/LoginPage'
import { AppProvider, useApp } from './pages/store'

function Shell() {
  const { loggedIn, login, logout, userType } = useApp()

  if (!loggedIn) return <LoginPage onLogin={login} />

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Logout Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={logout}
          className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 shadow-md transition-all flex items-center gap-2"
        >
          Logout
        </button>
      </div>

      {/* Route based on user type */}
      {userType === 'admin' ? (
        <AdminDashboard onLogout={logout} />
      ) : (
        <div className="flex items-start justify-center min-h-screen pt-16 pb-8">
          <MobileApp />
        </div>
      )}
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
