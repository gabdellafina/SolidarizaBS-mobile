import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, User } from 'lucide-react'
import clsx from 'clsx'

const tabs = [
  { path: '/home', icon: Home, label: 'Início' },
  { path: '/projetos', icon: Search, label: 'Projetos' },
  { path: '/perfil', icon: User, label: 'Perfil' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/home') return location.pathname === '/home'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={clsx(
              'flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors',
              isActive(tab.path) ? 'text-[#4C8BF5]' : 'text-gray-400'
            )}
          >
            <tab.icon size={22} strokeWidth={isActive(tab.path) ? 2.5 : 1.5} />
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
