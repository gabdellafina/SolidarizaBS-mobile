import { create } from 'zustand'
import * as campanhaService from '../services/campanhaService'

export const useCampanhaStore = create((set, get) => ({
  campanhas: [],
  isLoading: false,

  fetchCampanhas: async () => {
    set({ isLoading: true })
    try {
      const campanhas = await campanhaService.getAll()
      set({ campanhas, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  getByOngId: (ongId) => get().campanhas.filter((c) => c.ongId === ongId),

  getAtivas: () => get().campanhas.filter((c) => c.ativa),

  create: async (data) => {
    const nova = await campanhaService.create(data)
    set((s) => ({ campanhas: [nova, ...s.campanhas] }))
    return nova
  },

  update: async (id, data) => {
    const updated = await campanhaService.update(id, data)
    set((s) => ({
      campanhas: s.campanhas.map((c) => (c.id === id ? { ...c, ...updated } : c)),
    }))
    return updated
  },

  remove: async (id) => {
    await campanhaService.remove(id)
    set((s) => ({ campanhas: s.campanhas.filter((c) => c.id !== id) }))
  },

  toggleAtiva: async (id) => {
    const updated = await campanhaService.toggleAtiva(id)
    set((s) => ({
      campanhas: s.campanhas.map((c) => (c.id === id ? { ...c, ...updated } : c)),
    }))
  },

  // Doação — mock por enquanto (backend não tem endpoint de doação)
  // Incrementa arrecadado localmente para feedback visual imediato
  addDonation: async (id, valor) => {
    await campanhaService.addDonation(id, valor)
    set((s) => ({
      campanhas: s.campanhas.map((c) =>
        c.id === id ? { ...c, arrecadado: c.arrecadado + valor } : c
      ),
    }))
  },
}))
