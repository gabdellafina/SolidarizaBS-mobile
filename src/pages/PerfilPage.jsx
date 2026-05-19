import { useNavigate } from 'react-router-dom'
import { LogOut, Heart, Settings, ChevronRight, Clock, TrendingUp } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useDoacoes } from '../hooks/useDoacoes'
import { getInitials } from '../utils/helpers'
import { formatCurrency } from '../utils/formatters'
import Button from '../components/ui/Button'

export default function PerfilPage() {
  const { user, isLogged, logout } = useAuth()
  const { getTotalByUser, getCountByUser } = useDoacoes()
  const navigate = useNavigate()

  if (!isLogged) {
    return (
      <div className="pb-safe min-h-screen flex flex-col items-center justify-center px-8">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Heart size={32} className="text-gray-300" />
        </div>
        <h2 className="font-bold text-gray-900 text-lg mb-1">Entre na sua conta</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Faça login para acessar seu perfil e realizar doações</p>
        <Button className="w-full max-w-xs" onClick={() => navigate('/login')}>Entrar</Button>
        <button onClick={() => navigate('/cadastro')} className="mt-3 text-sm text-[#4C8BF5] font-semibold">Criar conta</button>
      </div>
    )
  }

  const total = getTotalByUser(user.id)
  const count = getCountByUser(user.id)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    {
      icon: Heart,
      label: 'Minhas doações',
      desc: `${count} doações · ${formatCurrency(total)}`,
      action: () => navigate('/historico'),
      color: 'bg-pink-50 text-pink-500',
    },
    {
      icon: Settings,
      label: 'Configurações',
      desc: 'Editar perfil e alterar senha',
      action: () => navigate('/configuracoes'),
      color: 'bg-blue-50 text-[#4C8BF5]',
    },
  ]

  return (
    <div className="pb-safe pt-14 px-4">
      {/* Avatar + info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-[#4C8BF5] text-white flex items-center justify-center text-xl font-extrabold shadow-md shadow-blue-200">
          {getInitials(user.nome)}
        </div>
        <div>
          <h2 className="font-extrabold text-lg text-gray-900">{user.nome}</h2>
          <p className="text-xs text-gray-500">{user.email}</p>
          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#4C8BF5] capitalize">{user.tipo}</span>
        </div>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <Heart size={18} className="text-pink-500 mx-auto mb-1" />
          <p className="text-lg font-extrabold text-gray-900">{count}</p>
          <p className="text-[9px] text-gray-500">Doações</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <TrendingUp size={18} className="text-green-500 mx-auto mb-1" />
          <p className="text-lg font-extrabold text-gray-900">{formatCurrency(total)}</p>
          <p className="text-[9px] text-gray-500">Total doado</p>
        </div>
      </div>

      {/* Menu */}
      <div className="space-y-1 mb-8">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-gray-100 active:bg-gray-50 transition-colors text-left"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
              <item.icon size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{item.label}</p>
              <p className="text-[10px] text-gray-500">{item.desc}</p>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-4 text-red-500 font-bold text-sm bg-red-50 rounded-2xl active:bg-red-100 transition-colors"
      >
        <LogOut size={16} /> Sair da conta
      </button>

      <p className="text-center text-[10px] text-gray-400 mt-6">SolidarizaBS v1.0 — FATEC Praia Grande</p>
    </div>
  )
}
