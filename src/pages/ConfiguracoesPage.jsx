import { useForm } from 'react-hook-form'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function ConfiguracoesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const setUser = useAuthStore((s) => s.setUser)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      nome: user?.nome || '',
      email: user?.email || '',
    },
  })

  const {
    register: registerSenha,
    handleSubmit: handleSenha,
    formState: { errors: errSenha },
    reset: resetSenha,
  } = useForm()

  const onSavePerfil = async (data) => {
    // >>> BACKEND: await api.put('/users/me', data)
    setUser({ ...user, ...data })
    toast.success('Perfil atualizado!')
  }

  const onChangeSenha = async (data) => {
    if (data.novaSenha !== data.confirmarSenha) {
      toast.error('As senhas não coincidem')
      return
    }
    if (data.novaSenha.length < 8) {
      toast.error('A nova senha deve ter no mínimo 8 caracteres')
      return
    }
    // >>> BACKEND: await api.put('/users/me/password', { senhaAtual: data.senhaAtual, novaSenha: data.novaSenha })
    toast.success('Senha alterada!')
    resetSenha()
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-safe">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 text-gray-500 active:bg-gray-100 rounded-xl">
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-extrabold text-gray-900">Configurações</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Editar perfil */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-4">Editar perfil</h2>
          <form onSubmit={handleSubmit(onSavePerfil)}>
            <Input
              label="Nome completo"
              {...register('nome', { required: 'Obrigatório', validate: (v) => v.trim().split(/\s+/).length >= 2 || 'Nome e sobrenome' })}
              error={errors.nome?.message}
            />
            <Input
              label="E-mail"
              type="email"
              {...register('email', { required: 'Obrigatório' })}
              error={errors.email?.message}
            />
            <Button type="submit" loading={isSubmitting} disabled={!isDirty} className="w-full">
              <CheckCircle2 size={16} /> Salvar alterações
            </Button>
          </form>
        </div>

        {/* Alterar senha */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-4">Alterar senha</h2>
          <form onSubmit={handleSenha(onChangeSenha)}>
            <Input
              label="Senha atual"
              type="password"
              placeholder="••••••••"
              {...registerSenha('senhaAtual', { required: 'Obrigatório' })}
              error={errSenha.senhaAtual?.message}
            />
            <Input
              label="Nova senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              {...registerSenha('novaSenha', { required: 'Obrigatório', minLength: { value: 8, message: 'Mínimo 8 caracteres' } })}
              error={errSenha.novaSenha?.message}
            />
            <Input
              label="Confirmar nova senha"
              type="password"
              placeholder="Repita a nova senha"
              {...registerSenha('confirmarSenha', { required: 'Obrigatório' })}
              error={errSenha.confirmarSenha?.message}
            />
            <Button type="submit" variant="outline" className="w-full">
              Alterar senha
            </Button>
          </form>
        </div>

        {/* Info da conta */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-3">Informações da conta</h2>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span className="text-gray-500">Tipo de conta</span>
              <span className="font-semibold capitalize">{user?.tipo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Membro desde</span>
              <span className="font-semibold">{user?.criadoEm}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
