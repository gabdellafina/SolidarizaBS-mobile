const express = require('express')
const cors = require('cors')
const path = require('path')

const setupSwagger = require('./swagger')
const authRoutes = require('./routes/auth')
const ongRoutes = require('./routes/ongs')
const campanhaRoutes = require('./routes/campanhas')
const userRoutes = require('./routes/users')
const relatorioRoutes = require('./routes/relatorios')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve arquivos de upload (fotos de ONGs)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Rotas
app.use('/api/auth', authRoutes)
app.use('/api/ongs', ongRoutes)
app.use('/api/campaigns', campanhaRoutes)
app.use('/api/users', userRoutes)
app.use('/api/reports', relatorioRoutes)

// Swagger
setupSwagger(app)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(errorHandler)

module.exports = app
