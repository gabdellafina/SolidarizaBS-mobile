import { CATEGORIAS } from './constants'
export const getCategoriaStyle = (cat) => CATEGORIAS.find(c => c.nome === cat)?.cor || 'bg-gray-100 text-gray-800 border-gray-200'
export const getCategoriaBg = (cat) => CATEGORIAS.find(c => c.nome === cat)?.corBg || 'bg-gray-50'
export const pct = (a, m) => m > 0 ? Math.min(100, Math.round((a / m) * 100)) : 0
export const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
