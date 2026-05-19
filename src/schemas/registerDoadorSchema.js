import { z } from 'zod'
import { differenceInYears, parseISO } from 'date-fns'
export const registerDoadorSchema = z.object({
  nome: z.string().min(1, 'Obrigatório').refine(v => v.trim().split(/\s+/).length >= 2, 'Informe nome e sobrenome'),
  email: z.string().min(1, 'Obrigatório').email('E-mail inválido'),
  senha: z.string().min(8, 'Mínimo 8 caracteres'),
  nascimento: z.string().min(1, 'Obrigatório').refine(v => { try { return differenceInYears(new Date(), parseISO(v)) >= 16 } catch { return false } }, 'Mínimo 16 anos'),
  termos: z.boolean().refine(v => v === true, 'Aceite os termos'),
})
