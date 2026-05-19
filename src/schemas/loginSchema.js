import { z } from 'zod'
export const loginSchema = z.object({ email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'), senha: z.string().min(8, 'Mínimo 8 caracteres') })
