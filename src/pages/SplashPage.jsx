import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'
import Button from '../components/ui/Button'
import logoSvg from '../assets/logo.svg'

export default function SplashPage() {
  const navigate = useNavigate()
  const { isLogged } = useAuth()

  useEffect(() => {
    if (isLogged) navigate('/home', { replace: true })
  }, [isLogged, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 bg-white">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Logo */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Solidariza<span className="text-[#4C8BF5]">BS</span>
        </h1>

        <div className="my-8">
          <img src={logoSvg} alt="SolidarizaBS" className="w-52 h-52" />
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-sm pb-12 space-y-3">
        <Button
          size="lg"
          className="w-full"
          onClick={() => navigate('/login')}
        >
          Entrar
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => navigate('/cadastro')}
        >
          Criar conta
        </Button>
      </div>
    </div>
  )
}
