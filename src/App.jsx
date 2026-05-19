import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import BottomNav from './components/layout/BottomNav'
import AppRoutes from './routes'

// Páginas SEM bottom nav (telas de auth e telas internas com back arrow)
const noNavPages = ['/', '/login', '/cadastro']
const noNavPrefixes = ['/doar/', '/historico', '/configuracoes']

export default function App() {
  const { restoreSession, isRestoring } = useAuthStore()
  const location = useLocation()

  useEffect(() => { restoreSession() }, [restoreSession])

  if (isRestoring) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-[#4C8BF5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  const showNav = !noNavPages.includes(location.pathname) &&
                  !noNavPrefixes.some((p) => location.pathname.startsWith(p))

  return (
    <div className="min-h-screen bg-white">
      <AppRoutes />
      {showNav && <BottomNav />}
    </div>
  )
}
