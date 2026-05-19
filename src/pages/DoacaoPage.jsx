import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { doacaoSchema } from '../schemas/doacaoSchema'
import { useCampanhas } from '../hooks/useCampanhas'
import { useOngs } from '../hooks/useOngs'
import { useAuth } from '../hooks/useAuth'
import { useDoacoes } from '../hooks/useDoacoes'
import { formatCurrency, generatePixCode } from '../utils/formatters'
import { pct } from '../utils/helpers'
import ProgressBar from '../components/ui/ProgressBar'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function DoacaoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { campanhas, addDonation } = useCampanhas()
  const { ongs } = useOngs()
  const { isLogged, user } = useAuth()
  const { addDoacao } = useDoacoes()
  const [pixCode, setPixCode] = useState(null)
  const [copied, setCopied] = useState(false)
  const [valorDoado, setValorDoado] = useState(0)

  const campanha = campanhas.find((c) => c.id === Number(id))
  const ong = campanha ? ongs.find((o) => o.id === campanha.ongId) : null

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(doacaoSchema),
  })

  const onSubmit = async (data) => {
    if (!isLogged) { navigate('/login'); return }

    // Gera Pix mock
    // >>> BACKEND: const { data: res } = await api.post('/donations', { campaignId: campanha.id, valor: data.valor })
    // >>> setPixCode(res.pixCode)
    const code = generatePixCode(ong?.pixChave || '', data.valor, ong?.nome)
    setPixCode(code)
    setValorDoado(data.valor)

    // Registra no store de campanhas (incrementa arrecadado)
    await addDonation(campanha.id, data.valor)

    // Registra no histórico de doações
    addDoacao({
      userId: user.id,
      campanhaId: campanha.id,
      ongId: ong.id,
      ongNome: ong.nome,
      campanhaTitulo: campanha.titulo,
      valor: data.valor,
    })

    toast.success('Doação registrada!')
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(pixCode)
    setCopied(true)
    toast.success('Código Pix copiado!')
    setTimeout(() => setCopied(false), 3000)
  }

  const setQuickValue = (v) => {
    setValue('valor', v, { shouldValidate: true })
  }

  if (!campanha || !ong) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-gray-500 mb-4">Campanha não encontrada.</p>
          <Button variant="secondary" onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-6 pt-14 pb-8">
      <button onClick={() => navigate(-1)} className="mb-4 p-2 -ml-2 text-gray-500 active:bg-gray-100 rounded-xl">
        <ArrowLeft size={24} />
      </button>

      {/* Info da campanha */}
      <div className="mb-6">
        <p className="text-xs text-gray-400 font-medium">{ong.nome}</p>
        <h1 className="text-xl font-extrabold text-gray-900 mt-1">{campanha.titulo}</h1>
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{campanha.descricao}</p>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{formatCurrency(campanha.arrecadado)}</span>
            <span>{pct(campanha.arrecadado, campanha.meta)}%</span>
          </div>
          <ProgressBar value={campanha.arrecadado} max={campanha.meta} />
          <p className="text-[10px] text-gray-400 mt-1">Meta: {formatCurrency(campanha.meta)}</p>
        </div>
      </div>

      {!pixCode ? (
        <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in">
          <h2 className="font-bold text-gray-900 mb-3">Quanto deseja doar?</h2>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {[10, 25, 50, 100].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setQuickValue(v)}
                className="py-2.5 text-xs font-bold text-[#4C8BF5] bg-blue-50 rounded-xl border border-blue-100 active:bg-blue-100 transition-colors"
              >
                R${v}
              </button>
            ))}
          </div>

          <Input
            label="Valor personalizado"
            type="number"
            min="1"
            step="0.01"
            placeholder="Outro valor"
            {...register('valor')}
            error={errors.valor?.message}
          />

          <Button type="submit" className="w-full mt-2" size="lg">
            Gerar código Pix
          </Button>
        </form>
      ) : (
        <div className="animate-fade-in">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-lg font-extrabold text-gray-900">Pix gerado!</h2>
            <p className="text-sm font-bold text-[#4C8BF5] mt-1">{formatCurrency(valorDoado)}</p>
            <p className="text-xs text-gray-500 mt-1">Copie o código e cole no app do seu banco</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-200">
            <p className="text-[10px] text-gray-400 font-semibold mb-2">CÓDIGO PIX COPIA E COLA</p>
            <p className="text-[11px] text-gray-700 font-mono break-all leading-relaxed select-all">{pixCode}</p>
          </div>

          <Button variant={copied ? 'success' : 'primary'} className="w-full" size="lg" onClick={handleCopy}>
            {copied ? <><Check size={18} /> Copiado!</> : <><Copy size={18} /> Copiar código Pix</>}
          </Button>

          <div className="flex gap-3 mt-4">
            <button onClick={() => { setPixCode(null); setValorDoado(0) }} className="flex-1 py-3 text-xs font-bold text-gray-500 bg-gray-100 rounded-xl active:bg-gray-200">
              Nova doação
            </button>
            <button onClick={() => navigate(`/ong/${ong.id}`)} className="flex-1 py-3 text-xs font-bold text-[#4C8BF5] bg-blue-50 rounded-xl active:bg-blue-100">
              Voltar à ONG
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
