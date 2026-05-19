import { useNavigate } from 'react-router-dom'
import { Heart, ArrowRight, TrendingUp, Building2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useOngs } from '../hooks/useOngs'
import { useCampanhas } from '../hooks/useCampanhas'
import { useDoacoes } from '../hooks/useDoacoes'
import { formatCurrency } from '../utils/formatters'
import { getCategoriaStyle, pct } from '../utils/helpers'
import ProgressBar from '../components/ui/ProgressBar'
import OngCard from '../components/cards/OngCard'
import logoSvg from '../assets/logo.svg'

export default function HomePage() {
  const navigate = useNavigate()
  const { user, isLogged } = useAuth()
  const { getApproved } = useOngs()
  const { getAtivas, campanhas } = useCampanhas()
  const { getTotalByUser, getCountByUser } = useDoacoes()

  const approved = getApproved()
  const ativas = getAtivas()
  const totalArrecadado = campanhas.reduce((s, c) => s + c.arrecadado, 0)

  // Agrupar ONGs por cidade para o carrossel
  const cidades = [...new Set(approved.map((o) => o.cidade))]

  return (
    <div className="pb-safe">
      {/* Header */}
      <div className="px-5 pt-14 pb-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-gray-500 font-medium">
              {isLogged ? `Olá, ${user.nome.split(' ')[0]}` : 'Bem-vindo ao'}
            </p>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Solidariza<span className="text-[#4C8BF5]">BS</span>
            </h1>
          </div>
          <img src={logoSvg} alt="Logo" className="w-10 h-10" />
        </div>

        {/* Stats rápidos */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
            <Building2 size={16} className="text-[#4C8BF5] mx-auto mb-1" />
            <p className="text-lg font-extrabold text-gray-900">{approved.length}</p>
            <p className="text-[9px] text-gray-500">ONGs</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
            <Heart size={16} className="text-pink-500 mx-auto mb-1" />
            <p className="text-lg font-extrabold text-gray-900">{ativas.length}</p>
            <p className="text-[9px] text-gray-500">Campanhas</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
            <TrendingUp size={16} className="text-green-500 mx-auto mb-1" />
            <p className="text-lg font-extrabold text-gray-900">{formatCurrency(totalArrecadado).replace('R$\u00a0', 'R$')}</p>
            <p className="text-[9px] text-gray-500">Arrecadado</p>
          </div>
        </div>

        {/* Minhas doações (se logado) */}
        {isLogged && (
          <button
            onClick={() => navigate('/historico')}
            className="mt-3 w-full flex items-center justify-between bg-white rounded-xl p-3.5 border border-gray-100 active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Heart size={16} className="text-[#4C8BF5]" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900">Minhas doações</p>
                <p className="text-[10px] text-gray-500">
                  {getCountByUser(user.id)} doações · {formatCurrency(getTotalByUser(user.id))}
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Campanhas em andamento */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-gray-900">Campanhas em andamento</h2>
          <span className="text-[10px] font-semibold text-[#4C8BF5] bg-blue-50 px-2 py-0.5 rounded-full">{ativas.length} ativas</span>
        </div>

        <div className="space-y-3">
          {ativas.slice(0, 5).map((c) => {
            const ong = approved.find((o) => o.id === c.ongId)
            return (
              <button
                key={c.id}
                onClick={() => navigate(`/doar/${c.id}`)}
                className="w-full bg-white rounded-2xl border border-gray-100 p-4 text-left active:scale-[0.99] transition-transform"
              >
                <div className="flex items-start gap-3">
                  {ong && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={ong.foto} alt={ong.nome} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">{c.titulo}</h3>
                    <p className="text-[10px] text-gray-500 truncate">{ong?.nome}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>{formatCurrency(c.arrecadado)}</span>
                        <span>{pct(c.arrecadado, c.meta)}%</span>
                      </div>
                      <ProgressBar value={c.arrecadado} max={c.meta} />
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ONGs por cidade */}
      {cidades.map((cidade) => {
        const ongsNaCidade = approved.filter((o) => o.cidade === cidade)
        return (
          <div key={cidade} className="py-3">
            <div className="flex items-center justify-between px-5 mb-2">
              <h3 className="text-sm font-bold text-gray-900">{cidade}</h3>
              <span className="text-[10px] text-gray-400">{ongsNaCidade.length} ONGs</span>
            </div>
            <div className="flex gap-3 overflow-x-auto px-5 scrollbar-hide">
              {ongsNaCidade.map((ong) => (
                <OngCard key={ong.id} ong={ong} compact />
              ))}
            </div>
          </div>
        )
      })}

      {/* Ver todos */}
      <div className="px-5 py-6">
        <button
          onClick={() => navigate('/projetos')}
          className="w-full py-3.5 bg-[#4C8BF5] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-md shadow-blue-200"
        >
          Ver todos os projetos <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
