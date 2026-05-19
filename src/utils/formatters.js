import { format, parseISO, differenceInYears } from 'date-fns'
import { ptBR } from 'date-fns/locale'
export const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
export const formatDate = (d) => { try { return format(parseISO(d), 'dd/MM/yyyy', { locale: ptBR }) } catch { return d } }
export const formatPhone = (v) => { const d = v.replace(/\D/g, '').slice(0, 11); if (!d.length) return ''; if (d.length <= 2) return '(' + d; if (d.length <= 7) return '(' + d.slice(0,2) + ')' + d.slice(2); return '(' + d.slice(0,2) + ')' + d.slice(2,7) + '-' + d.slice(7) }
export const formatCNPJ = (v) => { const d = v.replace(/\D/g, '').slice(0, 14); if (d.length <= 2) return d; if (d.length <= 5) return d.slice(0,2) + '.' + d.slice(2); if (d.length <= 8) return d.slice(0,2) + '.' + d.slice(2,5) + '.' + d.slice(5); if (d.length <= 12) return d.slice(0,2) + '.' + d.slice(2,5) + '.' + d.slice(5,8) + '/' + d.slice(8); return d.slice(0,2) + '.' + d.slice(2,5) + '.' + d.slice(5,8) + '/' + d.slice(8,12) + '-' + d.slice(12) }
export const getAge = (d) => { try { return differenceInYears(new Date(), parseISO(d)) } catch { return 0 } }
export const generateOngPhoto = (id) => 'https://picsum.photos/seed/ong' + id + '-' + Date.now() + '/400/300'
export const generatePixCode = (chave, valor, nome) => {
  const code = '00020126580014br.gov.bcb.pix0136' + chave + '5204000053039865802BR5913' + (nome || 'SOLIDARIZABS').slice(0,13).toUpperCase() + '6009SAOSPAULO62070503***6304'
  return code + Math.random().toString(36).slice(2, 6).toUpperCase()
}
