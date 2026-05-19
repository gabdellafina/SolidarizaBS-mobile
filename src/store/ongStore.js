import { create } from 'zustand'
import * as ongService from '../services/ongService'

export const useOngStore = create((set, get) => ({
  ongs: [],
  myOng: null,
  isLoading: false,

  filtros: {
    cidades: [],
    categorias: [],
    search: '',
  },

  // Carrega ONGs aprovadas (público)
  fetchOngs: async () => {
    set({ isLoading: true })
    try {
      const ongs = await ongService.getApproved()
      set({ ongs, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  // Carrega a ONG do usuário logado (tipo=ong)
  fetchMyOng: async () => {
    try {
      const ong = await ongService.getByUserId()
      set({ myOng: ong })
      return ong
    } catch {
      set({ myOng: null })
      return null
    }
  },

  // Getters locais (filtram o array já carregado)
  getApproved: () => get().ongs,

  getFiltered: () => {
    const { ongs, filtros } = get()
    return ongs.filter((o) => {
      if (filtros.cidades.length && !filtros.cidades.includes(o.cidade)) return false
      if (filtros.categorias.length && !filtros.categorias.includes(o.categoria)) return false
      if (filtros.search && !o.nome.toLowerCase().includes(filtros.search.toLowerCase())) return false
      return true
    })
  },

  getById: (id) => get().ongs.find((o) => o.id === Number(id)),

  // Filtros
  setFiltros: (f) => set((s) => ({ filtros: { ...s.filtros, ...f } })),

  toggleCidade: (c) =>
    set((s) => ({
      filtros: {
        ...s.filtros,
        cidades: s.filtros.cidades.includes(c)
          ? s.filtros.cidades.filter((x) => x !== c)
          : [...s.filtros.cidades, c],
      },
    })),

  toggleCategoria: (c) =>
    set((s) => ({
      filtros: {
        ...s.filtros,
        categorias: s.filtros.categorias.includes(c)
          ? s.filtros.categorias.filter((x) => x !== c)
          : [...s.filtros.categorias, c],
      },
    })),

  clearFiltros: () => set({ filtros: { cidades: [], categorias: [], search: '' } }),

  // CRUD
  createOng: async (data) => {
    const newOng = await ongService.create(data)
    set((s) => ({ ongs: [...s.ongs, newOng], myOng: newOng }))
    return newOng
  },

  updateOng: async (id, data) => {
    const updated = await ongService.update(id, data)
    set((s) => ({
      ongs: s.ongs.map((o) => (o.id === id ? updated : o)),
      myOng: s.myOng?.id === id ? updated : s.myOng,
    }))
    return updated
  },

  uploadFoto: async (ongId, file) => {
    const result = await ongService.uploadFoto(ongId, file)
    // result = { url, ong }
    set((s) => ({
      ongs: s.ongs.map((o) => (o.id === ongId ? result.ong : o)),
      myOng: s.myOng?.id === ongId ? result.ong : s.myOng,
    }))
    return result
  },

  approveOng: async (id) => {
    const updated = await ongService.approve(id)
    set((s) => ({ ongs: s.ongs.map((o) => (o.id === id ? updated : o)) }))
  },

  rejectOng: async (id) => {
    const updated = await ongService.reject(id)
    set((s) => ({ ongs: s.ongs.map((o) => (o.id === id ? updated : o)) }))
  },
}))
