export const isValidCNPJ = (cnpj) => { const d = cnpj.replace(/\D/g, ''); return d.length === 14 }
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
