import { z } from 'zod'
export const doacaoSchema = z.object({ valor: z.coerce.number({ invalid_type_error: 'Valor inválido' }).positive('Deve ser maior que zero').min(1, 'Mínimo R$1,00') })
