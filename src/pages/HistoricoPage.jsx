import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Calendar, TrendingUp } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useDoacoes } from '../hooks/useDoacoes'
import { formatCurrency, formatDate } from '../utils/formatters'

export default function HistoricoPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getByUserId, getTotalByUser, getCountByUser } = useDoacoes()

  const doacoes = user ? getByUserId(user.id) : []
  const total = user ? getTotalByUser(user.id) : 0
  const count = user ? getCountByUser(user.id) : 0

  // Agrupar por mês
  const grouped = doacoes.reduce((acc, d) => {
    const key = d.data.slice(0, 7) // "2025-05"
    if (!acc[key]) acc[key] = []
    acc[key].push(d)
    return acc
  }, {})

  const formatMonth = (key) => {
    const [year, month] = key.split('-')
    const meses = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    return `${meses[parseInt(month)]} ${year}`
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 text-gray-500 active:bg-gray-100 rounded-xl">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-extrabold text-gray-900">Minhas doações</h1>
        </div>
      </div>

      {/* Resumo */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Heart size={18} className="text-[#4C8BF5]" />
              </div>
              <p className="text-xl font-extrabold text-gray-900">{count}</p>
              <p className="text-[10px] text-gray-500">Doações realizadas</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <TrendingUp size={18} className="text-green-500" />
              </div>
              <p className="text-xl font-extrabold text-gray-900">{formatCurrency(total)}</p>
              <p className="text-[10px] text-gray-500">Total doado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista agrupada por mês */}
      <div className="px-4">
        {doacoes.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 text-sm font-medium">Nenhuma doação ainda</p>
            <p className="text-gray-400 text-xs mt-1">Suas doações aparecerão aqui</p>
            <button
              onClick={() => navigate('/projetos')}
              className="mt-4 px-6 py-2.5 bg-[#4C8BF5] text-white text-xs font-bold rounded-xl"
            >
              Explorar projetos
            </button>
          </div>
        ) : (
          Object.entries(grouped).map(([month, items]) => (
            <div key={month} className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={12} className="text-gray-400" />
                <h3 className="text-xs font-bold text-gray-500 uppercase">{formatMonth(month)}</h3>
              </div>
              <div className="space-y-2">
                {items.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => navigate(`/ong/${d.ongId}`)}
                    className="w-full bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 text-left active:bg-gray-50"
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Heart size={16} className="text-[#4C8BF5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{d.campanhaTitulo}</p>
                      <p className="text-[10px] text-gray-500 truncate">{d.ongNome}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-extrabold text-green-600">{formatCurrency(d.valor)}</p>
                      <p className="text-[9px] text-gray-400">{formatDate(d.data)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
