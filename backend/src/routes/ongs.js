const router = require('express').Router()
const auth = require('../middlewares/auth')
const roles = require('../middlewares/roles')
const upload = require('../middlewares/upload')
const {
  getApproved,
  getAll,
  getMe,
  getPending,
  getById,
  create,
  update,
  remove,
  approve,
  reject,
  uploadFoto,
} = require('../controllers/ongController')

// Rotas estáticas DEVEM vir antes de /:id para não conflitar

// Admin
router.get('/all', auth, roles('admin'), getAll)
router.get('/admin/pending', auth, roles('admin'), getPending)

// ONG autenticada
router.get('/me', auth, roles('ong'), getMe)

// Público
router.get('/', getApproved)
router.get('/:id', getById)

// Criar ONG
router.post('/', auth, roles('ong'), create)

// Atualizar e foto
router.put('/:id', auth, roles('ong', 'admin'), update)
router.post('/:id/foto', auth, roles('ong', 'admin'), upload.single('file'), uploadFoto)

// Admin: aprovar, rejeitar, remover
router.patch('/:id/approve', auth, roles('admin'), approve)
router.patch('/:id/reject', auth, roles('admin'), reject)
router.delete('/:id', auth, roles('admin'), remove)

module.exports = router
