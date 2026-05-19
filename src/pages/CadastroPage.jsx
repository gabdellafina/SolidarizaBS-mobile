import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import RegisterDoadorForm from '../components/forms/RegisterDoadorForm'
import RegisterOngForm from '../components/forms/RegisterOngForm'

export default function CadastroPage() {
  const [tipo, setTipo] = useState('doador')
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-white px-6 pt-14 pb-8">
      <button onClick={() => navigate(-1)} className="mb-4 p-2 -ml-2 text-gray-500 active:bg-gray-100 rounded-xl">
        <ArrowLeft size={24} />
      </button>
      <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
        <button onClick={() => setTipo('doador')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tipo === 'doador' ? 'bg-[#4C8BF5] text-white shadow-md' : 'text-gray-500'}`}>Conta pessoal</button>
        <button onClick={() => setTipo('ong')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tipo === 'ong' ? 'bg-[#4C8BF5] text-white shadow-md' : 'text-gray-500'}`}>Tenho uma ONG</button>
      </div>
      {tipo === 'doador' ? <RegisterDoadorForm /> : <RegisterOngForm />}
    </div>
  )
}
