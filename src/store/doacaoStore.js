import { create } from 'zustand'
import { mockDoacoes } from '../data/mockDoacoes'

// =============================================================================
// DOAÇÃO STORE
// =============================================================================
// Gerencia histórico de doações do usuário.
//
// ENDPOINTS ESPERADOS NO BACKEND:
//   POST /donations             → { campaignId, valor } → cria doação + gera Pix
//   GET  /donations             → lista doações do usuário logado
//   GET  /donations/:id         → detalhes de uma doação
//   POST /donations/:id/confirm → confirmar doação (webhook ou manual)
// =============================================================================

export const useDoacaoStore = create((set, get) => ({
  doacoes: [...mockDoacoes],
  isLoading: false,

  // >>> BACKEND: const { data } = await api.get('/donations'); set({ doacoes: data })
  fetchDoacoes: async () => {
    set({ isLoading: true })
    // Mock: já carregado
    set({ isLoading: false })
  },

  getByUserId: (userId) => get().doacoes.filter((d) => d.userId === userId),

  getTotalByUser: (userId) =>
    get().doacoes.filter((d) => d.userId === userId).reduce((sum, d) => sum + d.valor, 0),

  getCountByUser: (userId) =>
    get().doacoes.filter((d) => d.userId === userId).length,

  addDoacao: (doacao) => {
    const nova = {
      id: get().doacoes.length + 1,
      ...doacao,
      data: new Date().toISOString().split('T')[0],
      status: 'confirmada',
    }
    set((s) => ({ doacoes: [nova, ...s.doacoes] }))
    return nova
    // >>> BACKEND: const { data } = await api.post('/donations', { campaignId, valor }); return data
  },
}))
