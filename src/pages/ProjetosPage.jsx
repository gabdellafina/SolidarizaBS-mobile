import { useState } from 'react'
import { ChevronDown, X, Search } from 'lucide-react'
import { useOngs } from '../hooks/useOngs'
import { CIDADES, CATEGORIAS } from '../utils/constants'
import OngCard from '../components/cards/OngCard'

export default function ProjetosPage() {
  const { getFiltered, filtros, toggleCidade, toggleCategoria, clearFiltros } = useOngs()
  const [showCidade, setShowCidade] = useState(false)
  const [showCategoria, setShowCategoria] = useState(false)
  const filtered = getFiltered()
  const hasFilters = filtros.cidades.length > 0 || filtros.categorias.length > 0

  return (
    <div className="pb-safe">
      {/* Header fixo */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-extrabold text-gray-900">Projetos</h1>
          {hasFilters && (
            <button onClick={clearFiltros} className="text-xs font-semibold text-red-500 active:text-red-700">
              Limpar todos
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <button
              onClick={() => { setShowCidade(!showCidade); setShowCategoria(false) }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${filtros.cidades.length ? 'border-[#4C8BF5] text-[#4C8BF5] bg-blue-50' : 'border-gray-200 text-gray-600'}`}
            >
              {filtros.cidades.length ? filtros.cidades.join(', ').slice(0, 18) : 'Cidade'}
              <ChevronDown size={14} className={`transition-transform ${showCidade ? 'rotate-180' : ''}`} />
            </button>
            {showCidade && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-50 p-2 max-h-52 overflow-y-auto animate-fade-in">
                {CIDADES.map((c) => (
                  <label key={c} className="flex items-center gap-2 px-2 py-2 text-xs text-gray-700 rounded-lg active:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={filtros.cidades.includes(c)} onChange={() => toggleCidade(c)} className="accent-[#4C8BF5] rounded" />
                    {c}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex-1">
            <button
              onClick={() => { setShowCategoria(!showCategoria); setShowCidade(false) }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${filtros.categorias.length ? 'border-[#4C8BF5] text-[#4C8BF5] bg-blue-50' : 'border-gray-200 text-gray-600'}`}
            >
              {filtros.categorias.length ? filtros.categorias[0].slice(0, 12) : 'Tipo de causa'}
              <ChevronDown size={14} className={`transition-transform ${showCategoria ? 'rotate-180' : ''}`} />
            </button>
            {showCategoria && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-50 p-2 max-h-52 overflow-y-auto animate-fade-in">
                {CATEGORIAS.map((c) => (
                  <label key={c.nome} className="flex items-center gap-2 px-2 py-2 text-xs text-gray-700 rounded-lg active:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={filtros.categorias.includes(c.nome)} onChange={() => toggleCategoria(c.nome)} className="accent-[#4C8BF5] rounded" />
                    {c.nome}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fechar dropdowns */}
      {(showCidade || showCategoria) && (
        <div className="fixed inset-0 z-30" onClick={() => { setShowCidade(false); setShowCategoria(false) }} />
      )}

      {/* Grid */}
      <div className="px-4 pt-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm font-medium">Nenhuma ONG encontrada.</p>
            {hasFilters && (
              <button onClick={clearFiltros} className="mt-3 text-xs text-[#4C8BF5] font-semibold">Limpar filtros</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((ong) => (
              <OngCard key={ong.id} ong={ong} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
