const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const gerarToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, tipo: user.tipo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { nome, email, senha, tipo, nascimento } = req.body

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, email, senha, tipo' })
    }

    if (!['ong', 'doador'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo inválido. Use "ong" ou "doador"' })
    }

    const existe = await prisma.user.findUnique({ where: { email } })
    if (existe) {
      return res.status(409).json({ error: 'E-mail já cadastrado' })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        tipo,
        nascimento: nascimento ? new Date(nascimento) : null,
      },
      select: { id: true, nome: true, email: true, tipo: true, nascimento: true, criadoEm: true },
    })

    const token = gerarToken(user)
    res.status(201).json({ user, token })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' })
    }

    const senhaValida = await bcrypt.compare(senha, user.senha)
    if (!senhaValida) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos' })
    }

    const { senha: _, ...userSemSenha } = user
    const token = gerarToken(user)
    res.json({ user: userSemSenha, token })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/logout
const logout = async (req, res) => {
  // O logout é responsabilidade do frontend (remover token do localStorage)
  res.json({ message: 'Logout realizado com sucesso' })
}

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, nome: true, email: true, tipo: true, nascimento: true, criadoEm: true },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json({ user })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, logout, getMe }
