import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { loginSchema } from '../../schemas/loginSchema'
import { useAuth } from '../../hooks/useAuth'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function LoginForm() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data) => {
    const result = await login(data.email, data.senha)
    if (result.success) { toast.success('Bem-vindo!'); navigate('/home') }
    else toast.error(result.error)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="E-mail" type="email" placeholder="seu@email.com" {...register('email')} error={errors.email?.message} />
      <Input label="Senha" type="password" placeholder="••••••••" {...register('senha')} error={errors.senha?.message} />
      <Button type="submit" loading={isLoading} className="w-full" size="lg">Entrar</Button>
      <div className="mt-4 pt-3 border-t border-gray-100 text-[10px] text-gray-400 space-y-0.5">
        <p>Demo: joao@email.com / user1234</p>
      </div>
    </form>
  )
}
