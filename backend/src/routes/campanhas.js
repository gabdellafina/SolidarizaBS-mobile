const router = require('express').Router()
const auth = require('../middlewares/auth')
const roles = require('../middlewares/roles')
const { getAll, getById, create, update, remove, toggleAtiva } = require('../controllers/campanhaController')

// Rotas públicas
router.get('/', getAll)          // suporta ?ongId=X
router.get('/:id', getById)

// Rotas autenticadas
router.post('/', auth, roles('ong'), create)
router.put('/:id', auth, roles('ong', 'admin'), update)
router.delete('/:id', auth, roles('ong', 'admin'), remove)
router.patch('/:id/toggle', auth, roles('ong', 'admin'), toggleAtiva)

module.exports = router
