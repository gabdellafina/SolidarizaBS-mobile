import { useNavigate } from 'react-router-dom'
import { getCategoriaStyle } from '../../utils/helpers'

export default function OngCard({ ong, compact }) {
  const navigate = useNavigate()

  if (compact) {
    return (
      <button onClick={() => navigate(`/ong/${ong.id}`)} className="flex-shrink-0 w-28 text-center">
        <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-100 mb-1.5">
          <img src={ong.foto} alt={ong.nome} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <p className="text-[10px] font-bold text-gray-900 leading-tight line-clamp-2">{ong.nome}</p>
        <span className={`inline-block mt-0.5 text-[8px] font-semibold px-1.5 py-0.5 rounded-full border ${getCategoriaStyle(ong.categoria)}`}>{ong.categoria}</span>
      </button>
    )
  }

  return (
    <button onClick={() => navigate(`/ong/${ong.id}`)} className="bg-white rounded-2xl border border-gray-100 overflow-hidden text-left active:scale-[0.98] transition-transform w-full">
      <div className="h-32 overflow-hidden bg-gray-100">
        <img src={ong.foto} alt={ong.nome} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${getCategoriaStyle(ong.categoria)}`}>{ong.cidade}</span>
        </div>
        <h3 className="font-bold text-gray-900 text-xs leading-tight line-clamp-2">{ong.nome}</h3>
        <span className={`inline-block mt-1 text-[9px] font-medium px-1.5 py-0.5 rounded-full border ${getCategoriaStyle(ong.categoria)}`}>{ong.categoria}</span>
        <div className="mt-2 py-1.5 text-[10px] font-bold text-[#4C8BF5] bg-blue-50 rounded-lg text-center">Conhecer</div>
      </div>
    </button>
  )
}
