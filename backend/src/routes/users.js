const router = require('express').Router()
const auth = require('../middlewares/auth')
const roles = require('../middlewares/roles')
const { getAll, getById, remove } = require('../controllers/userController')

// Todas as rotas de usuário são admin
router.get('/', auth, roles('admin'), getAll)
router.get('/:id', auth, roles('admin'), getById)
router.delete('/:id', auth, roles('admin'), remove)

module.exports = router
