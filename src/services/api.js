import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: adiciona token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('solidarizabs_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: trata erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('solidarizabs_token')
    }

    // Extrai mensagem de erro do backend
    const message = error.response?.data?.error || error.message || 'Erro desconhecido'
    return Promise.reject(new Error(message))
  }
)

export default api

// Helper para upload de arquivos (multipart/form-data)
export const uploadFile = async (endpoint, file, extraFields = {}) => {
  const formData = new FormData()
  formData.append('file', file)
  Object.entries(extraFields).forEach(([key, value]) => {
    formData.append(key, value)
  })
  return api.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
