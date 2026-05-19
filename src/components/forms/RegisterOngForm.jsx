import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Upload, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { ongStep1Schema, ongStep2Schema, ongStep3Schema } from '../../schemas/registerOngSchema'
import { useAuth } from '../../hooks/useAuth'
import { useOngStore } from '../../store/ongStore'
import { CIDADES, CATEGORIAS, PIX_TIPOS } from '../../utils/constants'
import { formatPhone, formatCNPJ } from '../../utils/formatters'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'

const schemas = [ongStep1Schema, ongStep2Schema, ongStep3Schema]

export default function RegisterOngForm() {
  const [step, setStep] = useState(0)
  const [allData, setAllData] = useState({})
  const [fotoPreview, setFotoPreview] = useState(null)
  const [fotoFile, setFotoFile] = useState(null)
  const { register: registerUser, isLoading } = useAuth()
  const createOng = useOngStore((s) => s.createOng)
  const uploadFoto = useOngStore((s) => s.uploadFoto)
  const navigate = useNavigate()
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schemas[step]),
    defaultValues: step === 2 ? { termos: false } : {},
  })

  const onSubmit = async (data) => {
    const merged = { ...allData, ...data }
    if (step < 2) { setAllData(merged); setStep(step + 1); reset(); return }

    // 1. Registra usuário tipo 'ong'
    const result = await registerUser(
      { responsavel: merged.responsavel, emailInst: merged.emailInst, senha: merged.senha },
      'ong'
    )

    if (!result.success) { toast.error(result.error); return }

    try {
      // 2. Cria a ONG (backend usa token para associar ao usuário)
      const ong = await createOng({
        nome: merged.nomeOng,
        descricao: merged.descricao,
        categoria: merged.tipoCausa,
        cidade: merged.cidade,
        endereco: merged.endereco,
        cnpj: merged.cnpj,
        pixChave: merged.pixChave,
        pixTipo: merged.pixTipo,
        email: merged.emailInst,
        telefone: merged.telefone,
        instagram: '',
      })

      // 3. Se tem foto, faz upload separado
      if (fotoFile && ong?.id) {
        try {
          await uploadFoto(ong.id, fotoFile)
        } catch {
          // Não impede o cadastro se foto falhar
          toast.error('Foto não enviada, mas ONG foi cadastrada.')
        }
      }

      toast.success('ONG cadastrada! Aguarde aprovação.')
      navigate('/home')
    } catch (err) {
      toast.error(err.message || 'Erro ao cadastrar ONG')
    }
  }

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setFotoPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1.5">Etapa {step + 1} de 3</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="h-full bg-[#4C8BF5] rounded-full transition-all" style={{ width: ((step + 1) / 3 * 100) + '%' }} />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 0 && <>
          <Input label="Nome da ONG *" {...register('nomeOng')} error={errors.nomeOng?.message} />
          <Input label="Responsável *" placeholder="Nome e sobrenome" {...register('responsavel')} error={errors.responsavel?.message} />
          <Input label="E-mail institucional *" type="email" {...register('emailInst')} error={errors.emailInst?.message} />
          <Controller name="telefone" control={control} defaultValue="" render={({ field }) => (
            <Input label="Telefone *" placeholder="(13)99999-9999" value={field.value} onChange={(e) => field.onChange(formatPhone(e.target.value))} error={errors.telefone?.message} />
          )} />
          <Select label="Cidade *" {...register('cidade')} error={errors.cidade?.message}>
            <option value="">Selecione</option>
            {CIDADES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select label="Tipo de causa *" {...register('tipoCausa')} error={errors.tipoCausa?.message}>
            <option value="">Selecione</option>
            {CATEGORIAS.map((c) => <option key={c.nome} value={c.nome}>{c.nome}</option>)}
          </Select>
        </>}

        {step === 1 && <>
          <Controller name="cnpj" control={control} defaultValue="" render={({ field }) => (
            <Input label="CNPJ *" placeholder="00.000.000/0001-00" value={field.value} onChange={(e) => field.onChange(formatCNPJ(e.target.value))} error={errors.cnpj?.message} />
          )} />
          <Input label="Endereço *" {...register('endereco')} error={errors.endereco?.message} />
          <Textarea label="Descrição *" placeholder="Mín. 20 caracteres" {...register('descricao')} error={errors.descricao?.message} />
        </>}

        {step === 2 && <>
          <Select label="Tipo de chave Pix *" {...register('pixTipo')} error={errors.pixTipo?.message}>
            <option value="">Selecione</option>
            {PIX_TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </Select>
          <Input label="Chave Pix *" {...register('pixChave')} error={errors.pixChave?.message} />
          <Input label="Senha *" type="password" placeholder="Mínimo 8 caracteres" {...register('senha')} error={errors.senha?.message} />
          <Input label="Data de criação *" type="date" {...register('dataCriacao')} error={errors.dataCriacao?.message} />
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Foto de perfil</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                {fotoPreview ? <img src={fotoPreview} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-400" />}
              </div>
              <label className="cursor-pointer px-3 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5">
                <Upload size={12} />{fotoPreview ? 'Trocar' : 'Escolher'}
                <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
              </label>
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <input type="checkbox" {...register('termos')} className="accent-[#4C8BF5]" /> Aceito os Termos *
          </label>
          {errors.termos && <p className="text-red-500 text-xs mb-2">{errors.termos.message}</p>}
        </>}

        <div className="flex gap-3 mt-4">
          {step > 0 && <Button type="button" variant="outline" onClick={() => { setStep(step - 1); reset() }} className="flex-1" size="lg">Voltar</Button>}
          <Button type="submit" loading={isLoading} className="flex-1" size="lg">{step < 2 ? 'Continuar' : 'Cadastrar'}</Button>
        </div>
      </form>
    </div>
  )
}
