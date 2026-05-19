import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { registerDoadorSchema } from '../../schemas/registerDoadorSchema'
import { useAuth } from '../../hooks/useAuth'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function RegisterDoadorForm() {
  const { register: registerUser, isLoading } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerDoadorSchema), defaultValues: { termos: false } })

  const onSubmit = async (data) => {
    const result = await registerUser(data, 'doador')
    if (result.success) { toast.success('Cadastro realizado!'); navigate('/home') }
    else toast.error(result.error)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Nome Completo *" placeholder="Nome e sobrenome" {...register('nome')} error={errors.nome?.message} />
      <Input label="E-mail *" type="email" placeholder="seu@email.com" {...register('email')} error={errors.email?.message} />
      <Input label="Senha *" type="password" placeholder="Mínimo 8 caracteres" {...register('senha')} error={errors.senha?.message} />
      <Input label="Data de Nascimento *" type="date" {...register('nascimento')} error={errors.nascimento?.message} />
      <label className="flex items-center gap-2 text-xs text-gray-600 mb-2"><input type="checkbox" {...register('termos')} className="accent-[#4C8BF5]" /> Concordo com os Termos e Condições *</label>
      {errors.termos && <p className="text-red-500 text-xs mb-2">{errors.termos.message}</p>}
      <label className="flex items-center gap-2 text-xs text-gray-600 mb-4"><input type="checkbox" className="accent-[#4C8BF5]" /> Quero receber novidades</label>
      <Button type="submit" loading={isLoading} className="w-full" size="lg">Cadastrar</Button>
    </form>
  )
}
