const errorHandler = (err, req, res, next) => {
  console.error(err)

  // Erro de validação do Multer
  if (err.name === 'MulterError' || err.message?.includes('Tipo de arquivo')) {
    return res.status(400).json({ error: err.message })
  }

  // Erros do Prisma
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'campo'
    return res.status(409).json({ error: `Já existe um registro com esse ${field}` })
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Registro não encontrado' })
  }

  const status = err.status || 500
  const message = err.message || 'Erro interno no servidor'

  res.status(status).json({ error: message })
}

module.exports = errorHandler
