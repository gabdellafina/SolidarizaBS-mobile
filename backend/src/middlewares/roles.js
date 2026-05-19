// Middleware de controle de acesso por perfil
// Uso: router.get('/rota', auth, roles('admin'), handler)
//      router.get('/rota', auth, roles('admin', 'ong'), handler)

const roles = (...tiposPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Não autenticado' })
    }

    if (!tiposPermitidos.includes(req.user.tipo)) {
      return res.status(403).json({ error: 'Acesso negado: permissão insuficiente' })
    }

    next()
  }
}

module.exports = roles
