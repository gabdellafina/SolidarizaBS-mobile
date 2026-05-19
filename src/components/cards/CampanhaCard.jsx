import { useNavigate } from 'react-router-dom'
import ProgressBar from '../ui/ProgressBar'
import Badge from '../ui/Badge'
import { formatCurrency } from '../../utils/formatters'
import { pct } from '../../utils/helpers'

export default function CampanhaCard({ campanha, ongNome }) {
  const navigate = useNavigate()

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-white">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-bold text-sm text-gray-900 flex-1">{campanha.titulo}</h3>
        <Badge className={campanha.ativa ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}>
          {campanha.ativa ? 'Ativa' : 'Encerrada'}
        </Badge>
      </div>
      {ongNome && <p className="text-[10px] text-gray-400">{ongNome}</p>}
      <p className="text-gray-500 text-xs mt-1 line-clamp-2">{campanha.descricao}</p>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{formatCurrency(campanha.arrecadado)} arrecadados</span>
          <span>{pct(campanha.arrecadado, campanha.meta)}%</span>
        </div>
        <ProgressBar value={campanha.arrecadado} max={campanha.meta} />
        <p className="text-[10px] text-gray-400 mt-1">Meta: {formatCurrency(campanha.meta)}</p>
      </div>
      {campanha.ativa && (
        <button
          onClick={() => navigate(`/doar/${campanha.id}`)}
          className="mt-3 w-full py-2.5 bg-[#4C8BF5] text-white font-bold text-xs rounded-xl active:scale-[0.98] transition-transform"
        >
          Doar
        </button>
      )}
    </div>
  )
}
