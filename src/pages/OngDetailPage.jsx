import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, CheckCircle2, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import * as ongService from '../services/ongService'
import { useAuth } from '../hooks/useAuth'
import { getCategoriaStyle } from '../utils/helpers'
import { formatDate, formatCurrency, generatePixCode } from '../utils/formatters'
import { pct } from '../utils/helpers'
import { InstagramIcon, WhatsAppIcon } from '../components/ui/SocialIcons'
import ProgressBar from '../components/ui/ProgressBar'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function OngDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLogged } = useAuth()

  const [ong, setOng] = useState(null)
  const [loading, setLoading] = useState(true)
  const [valorDoacao, setValorDoacao] = useState('')
  const [pixGerado, setPixGerado] = useState(false)
  const [pixCode, setPixCode] = useState('')
  const [copied, setCopied] = useState(false)

  // Busca ONG direto da API (inclui campanhas ativas)
  useEffect(() => {
    setLoading(true)
    ongService
      .getById(id)
      .then((data) => setOng(data))
      .catch(() => setOng(null))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  const campanhas = ong?.campanhas || []

  const handleGerarPix = () => {
    if (!valorDoacao || parseFloat(valorDoacao) <= 0) {
      toast.error('Informe um valor válido')
      return
    }
    // Gera código Pix mock
    // TODO: quando backend tiver endpoint de doação, chamar a API aqui
    const code = generatePixCode(ong?.pixChave || '', parseFloat(valorDoacao), ong?.nome)
    setPixCode(code)
    setPixGerado(true)
    toast.success('Código Pix gerado!')
  }

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(pixCode)
    setCopied(true)
    toast.success('Código Pix copiado!')
    setTimeout(() => setCopied(false), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#4C8BF5] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!ong) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-500 mb-4">ONG não encontrada.</p>
          <Button variant="secondary" onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-safe bg-gray-50/50 min-h-screen">
      {/* Banner */}
      <div className="relative">
        <div className="h-52 overflow-hidden bg-gray-200">
          {ong.foto && (
            <img src={ong.foto} alt={ong.nome} className="w-full h-full object-cover" />
          )}
        </div>
        <button onClick={() => navigate(-1)} className="absolute top-12 left-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md active:scale-95">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
      </div>

      <div className="px-4 -mt-4 relative z-10">
        {/* Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h1 className="text-xl font-extrabold text-gray-900">{ong.nome}</h1>
          <p className="text-xs text-gray-500 mt-1">Fundada em {formatDate(ong.criadoEm)} | {ong.cidade}, SP</p>
          <div className="flex gap-2 mt-2">
            <Badge className={getCategoriaStyle(ong.categoria)}>{ong.categoria}</Badge>
            <Badge className={getCategoriaStyle(ong.categoria)}>{ong.cidade}</Badge>
          </div>
        </div>

        {/* Sobre */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h2 className="font-bold text-gray-900 text-sm mb-2">Sobre Nós</h2>
          <p className="text-gray-600 text-xs leading-relaxed">{ong.descricao}</p>
        </div>

        {/* Doar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h2 className="font-bold text-gray-900 text-sm mb-3">Doar</h2>
          {!pixGerado ? (
            <>
              <Input
                label="Insira o valor"
                type="number"
                min="1"
                step="0.01"
                placeholder="R$ 50,00"
                value={valorDoacao}
                onChange={(e) => setValorDoacao(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={() => {
                  if (!isLogged) { navigate('/login'); return }
                  handleGerarPix()
                }}
              >
                Gerar código pix
              </Button>
            </>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={36} className="text-green-500" />
              </div>
              <p className="text-sm font-bold text-gray-900 mb-1">Pix gerado!</p>
              <p className="text-xs text-gray-500 mb-4">Copie o código e cole no seu app de banco</p>
              <div className="bg-gray-50 rounded-xl p-3 mb-3 border border-gray-200">
                <p className="text-[10px] text-gray-500 font-mono break-all leading-relaxed">{pixCode}</p>
              </div>
              <Button variant={copied ? 'success' : 'primary'} className="w-full" onClick={handleCopyPix}>
                {copied ? <><Check size={16} /> Copiado!</> : <><Copy size={16} /> Copiar código Pix</>}
              </Button>
              <button onClick={() => { setPixGerado(false); setValorDoacao(''); setPixCode('') }} className="mt-3 text-xs text-gray-500 underline">
                Gerar novo código
              </button>
            </div>
          )}
        </div>

        {/* Campanhas */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <h2 className="font-bold text-gray-900 text-sm mb-3">Campanhas em andamento</h2>
          {campanhas.length === 0 ? (
            <p className="text-gray-400 text-xs">Nenhuma campanha ativa.</p>
          ) : (
            <div className="space-y-3">
              {campanhas.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/doar/${c.id}`)}
                  className="w-full border border-gray-100 rounded-xl p-4 text-left active:bg-gray-50"
                >
                  <h3 className="text-sm font-bold text-gray-900">{c.titulo}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{c.descricao}</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                      <span>{formatCurrency(Number(c.arrecadado))} arrecadados</span>
                      <span>{pct(Number(c.arrecadado), Number(c.meta))}%</span>
                    </div>
                    <ProgressBar value={Number(c.arrecadado)} max={Number(c.meta)} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Contato */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <h2 className="font-bold text-gray-900 text-sm mb-3">Entre em Contato</h2>
          <div className="space-y-2.5">
            {ong.email && <div className="flex items-center gap-3 text-xs text-gray-600"><Mail size={14} className="text-blue-400" /> {ong.email}</div>}
            {ong.telefone && <div className="flex items-center gap-3 text-xs text-gray-600"><WhatsAppIcon size={14} className="text-green-500" /> {ong.telefone}</div>}
            {ong.instagram && <div className="flex items-center gap-3 text-xs text-gray-600"><InstagramIcon size={14} className="text-pink-500" /> {ong.instagram}</div>}
            <div className="flex items-center gap-3 text-xs text-gray-600"><MapPin size={14} className="text-blue-400" /> {ong.endereco}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
