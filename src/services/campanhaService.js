import api from './api'

// =============================================================================
// CAMPANHA SERVICE — conectado ao backend real
// =============================================================================
// GET    /api/campaigns              → todas (suporta ?ongId=X)
// GET    /api/campaigns/:id          → detalhes (inclui .ong)
// POST   /api/campaigns              → criar { ongId, titulo, descricao, meta }
// PUT    /api/campaigns/:id          → atualizar { titulo, descricao, meta }
// DELETE /api/campaigns/:id          → remover
// PATCH  /api/campaigns/:id/toggle   → ativar/desativar
//
// NOTA: O backend retorna meta e arrecadado como Number (já convertido de Decimal).
//       Cada campanha pode incluir .ong { id, nome, cidade, foto }.
// =============================================================================

export const getAll = async () => {
  const { data } = await api.get('/campaigns')
  return data
}

export const getByOngId = async (ongId) => {
  const { data } = await api.get(`/campaigns?ongId=${ongId}`)
  return data
}

export const getById = async (id) => {
  const { data } = await api.get(`/campaigns/${id}`)
  return data
}

export const create = async (campData) => {
  const { data } = await api.post('/campaigns', {
    ongId: campData.ongId,
    titulo: campData.titulo,
    descricao: campData.descricao,
    meta: Number(campData.meta),
  })
  return data
}

export const update = async (id, campData) => {
  const { data } = await api.put(`/campaigns/${id}`, {
    titulo: campData.titulo,
    descricao: campData.descricao,
    meta: campData.meta !== undefined ? Number(campData.meta) : undefined,
  })
  return data
}

export const remove = async (id) => {
  await api.delete(`/campaigns/${id}`)
}

export const toggleAtiva = async (id) => {
  const { data } = await api.patch(`/campaigns/${id}/toggle`)
  return data
}

// =============================================================================
// DOAÇÃO — o backend ainda não tem endpoint de doação.
// Por enquanto, simula no frontend.
// Quando o backend tiver POST /api/donations:
//   export const donate = async (campaignId, valor) => {
//     const { data } = await api.post('/donations', { campaignId, valor })
//     return data // { pixCode, donation }
//   }
// =============================================================================
export const addDonation = async (id, valor) => {
  // Mock: apenas incrementa localmente
  // TODO: substituir por chamada real quando endpoint existir
  console.log(`[MOCK] Doação de R$${valor} para campanha ${id}`)
  return { id, arrecadado: valor }
}
