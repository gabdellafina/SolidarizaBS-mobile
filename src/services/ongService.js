import api, { uploadFile } from './api'

// =============================================================================
// ONG SERVICE — conectado ao backend real
// =============================================================================
// GET    /api/ongs                → ONGs aprovadas (público, suporta ?cidade, ?categoria, ?search)
// GET    /api/ongs/all            → todas ONGs (admin)
// GET    /api/ongs/me             → ONG do usuário logado
// GET    /api/ongs/admin/pending  → pendentes (admin)
// GET    /api/ongs/:id            → detalhes com campanhas
// POST   /api/ongs                → criar ONG
// PUT    /api/ongs/:id            → atualizar
// POST   /api/ongs/:id/foto       → upload foto (multipart/form-data)
// PATCH  /api/ongs/:id/approve    → aprovar (admin)
// PATCH  /api/ongs/:id/reject     → rejeitar (admin)
// DELETE /api/ongs/:id            → remover (admin)
// =============================================================================

export const getAll = async () => {
  const { data } = await api.get('/ongs/all')
  return data
}

export const getApproved = async () => {
  const { data } = await api.get('/ongs')
  return data
}

export const getById = async (id) => {
  const { data } = await api.get(`/ongs/${id}`)
  return data
}

export const getByUserId = async () => {
  // O backend usa o token para saber qual user → usa /ongs/me
  const { data } = await api.get('/ongs/me')
  return data
}

export const getPending = async () => {
  const { data } = await api.get('/ongs/admin/pending')
  return data
}

export const create = async (ongData) => {
  const { data } = await api.post('/ongs', {
    nome: ongData.nome,
    descricao: ongData.descricao,
    categoria: ongData.categoria,
    cidade: ongData.cidade,
    endereco: ongData.endereco,
    cnpj: ongData.cnpj,
    pixChave: ongData.pixChave,
    pixTipo: ongData.pixTipo,
    email: ongData.email,
    telefone: ongData.telefone,
    instagram: ongData.instagram || '',
  })
  return data
}

export const update = async (id, ongData) => {
  const { data } = await api.put(`/ongs/${id}`, ongData)
  return data
}

export const uploadFoto = async (ongId, file) => {
  const { data } = await uploadFile(`/ongs/${ongId}/foto`, file)
  return data // { url, ong }
}

export const approve = async (id) => {
  const { data } = await api.patch(`/ongs/${id}/approve`)
  return data
}

export const reject = async (id) => {
  const { data } = await api.patch(`/ongs/${id}/reject`)
  return data
}

export const remove = async (id) => {
  await api.delete(`/ongs/${id}`)
}
