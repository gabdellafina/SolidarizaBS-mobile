import { z } from 'zod'
export const ongStep1Schema = z.object({
  nomeOng: z.string().min(3, 'Mínimo 3 caracteres'), responsavel: z.string().min(1, 'Obrigatório').refine(v => v.trim().split(/\s+/).length >= 2, 'Nome e sobrenome'),
  emailInst: z.string().min(1, 'Obrigatório').email('E-mail inválido'), telefone: z.string().min(1, 'Obrigatório').refine(v => v.replace(/\D/g, '').length >= 10, 'Telefone inválido'),
  cidade: z.string().min(1, 'Selecione'), tipoCausa: z.string().min(1, 'Selecione'),
})
export const ongStep2Schema = z.object({
  cnpj: z.string().min(1, 'Obrigatório').refine(v => v.replace(/\D/g, '').length === 14, 'CNPJ 14 dígitos'),
  endereco: z.string().min(5, 'Mínimo 5 caracteres'), descricao: z.string().min(20, 'Mínimo 20 caracteres'),
})
export const ongStep3Schema = z.object({
  pixTipo: z.string().min(1, 'Selecione'), pixChave: z.string().min(5, 'Obrigatório'),
  senha: z.string().min(8, 'Mínimo 8 caracteres'), dataCriacao: z.string().min(1, 'Obrigatório'),
  termos: z.boolean().refine(v => v === true, 'Aceite os termos'),
})
