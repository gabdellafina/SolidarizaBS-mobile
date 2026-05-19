const router = require('express').Router()
const auth = require('../middlewares/auth')
const roles = require('../middlewares/roles')
const {
  getDashboard,
  getOngsPorCidade,
  getOngsPorCategoria,
  getCampanhasRanking,
  getStatsOng,
} = require('../controllers/relatorioController')

// Todos os relatórios requerem admin
router.get('/dashboard', auth, roles('admin'), getDashboard)
router.get('/ongs-por-cidade', auth, roles('admin'), getOngsPorCidade)
router.get('/ongs-por-categoria', auth, roles('admin'), getOngsPorCategoria)
router.get('/campanhas', auth, roles('admin'), getCampanhasRanking)

// Stats de uma ONG específica - acessível pelo dono da ONG ou admin
router.get('/ong/:id', auth, roles('ong', 'admin'), getStatsOng)

module.exports = router
