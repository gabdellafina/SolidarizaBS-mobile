import api from './api'

// =============================================================================
// AUTH SERVICE — conectado ao backend real
// =============================================================================
// POST /api/auth/register → { nome, email, senha, tipo, nascimento? } → { user, token }
// POST /api/auth/login    → { email, senha }                         → { user, token }
// GET  /api/auth/me       → (Authorization header)                    → { user }
// POST /api/auth/logout   → (Authorization header)                    → { message }
// =============================================================================

export const login = async (email, senha) => {
  const { data } = await api.post('/auth/login', { email, senha })
  localStorage.setItem('solidarizabs_token', data.token)
  return data.user
}

export const register = async (data, tipo) => {
  const payload = {
    nome: data.nome || data.responsavel,
    email: data.email || data.emailInst,
    senha: data.senha,
    tipo,
    nascimento: data.nascimento || undefined,
  }
  const { data: res } = await api.post('/auth/register', payload)
  localStorage.setItem('solidarizabs_token', res.token)
  return res.user
}

export const getMe = async () => {
  const { data } = await api.get('/auth/me')
  return data.user
}

export const logout = async () => {
  try {
    await api.post('/auth/logout')
  } catch {
    // Ignora erro — o importante é limpar o token local
  } finally {
    localStorage.removeItem('solidarizabs_token')
  }
}

export const getUsers = async () => {
  const { data } = await api.get('/users')
  return data // array de users
}
