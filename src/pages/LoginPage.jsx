import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/forms/LoginForm'

export default function LoginPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white px-6 pt-14 pb-8">
      <button onClick={() => navigate(-1)} className="mb-6 p-2 -ml-2 text-gray-500 active:bg-gray-100 rounded-xl">
        <ArrowLeft size={24} />
      </button>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Entrar</h2>
      <LoginForm />
      <p className="text-center text-xs text-gray-500 mt-6">
        Não tem conta?{' '}
        <button onClick={() => navigate('/cadastro')} className="text-[#4C8BF5] font-semibold">Criar conta</button>
      </p>
    </div>
  )
}
