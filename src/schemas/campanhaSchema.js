import { z } from 'zod'
export const campanhaSchema = z.object({ titulo: z.string().min(3, 'Mínimo 3'), descricao: z.string().min(10, 'Mínimo 10'), meta: z.coerce.number({ invalid_type_error: 'Inválido' }).positive('Deve ser positivo') })
