const { PrismaClient } = require('@prisma/client')
const path = require('path')
const fs = require('fs')

const prisma = new PrismaClient()

// Selects reutilizáveis
const ongSelect = {
  id: true,
  userId: true,
  nome: true,
  descricao: true,
  categoria: true,
  cidade: true,
  endereco: true,
  cnpj: true,
  pixChave: true,
  pixTipo: true,
  status: true,
  email: true,
  telefone: true,
  instagram: true,
  foto: true,
  criadoEm: true,
}

// GET /api/ongs  → ONGs aprovadas (público)
const getApproved = async (req, res, next) => {
  try {
    const { cidade, categoria, search } = req.query

    const where = { status: 'aprovado' }
    if (cidade) where.cidade = cidade
    if (categoria) where.categoria = categoria
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { descricao: { contains: search, mode: 'insensitive' } },
      ]
    }

    const ongs = await prisma.ong.findMany({ where, select: ongSelect, orderBy: { criadoEm: 'desc' } })
    res.json(ongs)
  } catch (err) {
    next(err)
  }
}

// GET /api/ongs/all  → Todas as ONGs (admin)
const getAll = async (req, res, next) => {
  try {
    const ongs = await prisma.ong.findMany({
      select: { ...ongSelect, user: { select: { nome: true, email: true } } },
      orderBy: { criadoEm: 'desc' },
    })
    res.json(ongs)
  } catch (err) {
    next(err)
  }
}

// GET /api/ongs/me  → ONG do usuário logado
const getMe = async (req, res, next) => {
  try {
    const ong = await prisma.ong.findUnique({
      where: { userId: req.user.id },
      select: ongSelect,
    })

    if (!ong) {
      return res.status(404).json({ error: 'ONG não encontrada para este usuário' })
    }

    res.json(ong)
  } catch (err) {
    next(err)
  }
}

// GET /api/ongs/admin/pending  → ONGs pendentes (admin)
const getPending = async (req, res, next) => {
  try {
    const ongs = await prisma.ong.findMany({
      where: { status: 'pendente' },
      select: { ...ongSelect, user: { select: { nome: true, email: true } } },
      orderBy: { criadoEm: 'asc' },
    })
    res.json(ongs)
  } catch (err) {
    next(err)
  }
}

// GET /api/ongs/:id  → Detalhes de uma ONG com campanhas (público)
const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const ong = await prisma.ong.findUnique({
      where: { id },
      select: {
        ...ongSelect,
        campanhas: {
          where: { ativa: true },
          orderBy: { criadoEm: 'desc' },
        },
      },
    })

    if (!ong) {
      return res.status(404).json({ error: 'ONG não encontrada' })
    }

    res.json(ong)
  } catch (err) {
    next(err)
  }
}

// POST /api/ongs  → Criar ONG (auth, tipo=ong)
const create = async (req, res, next) => {
  try {
    const { nome, descricao, categoria, cidade, endereco, cnpj, pixChave, pixTipo, email, telefone, instagram } = req.body

    if (!nome || !descricao || !categoria || !cidade || !endereco || !cnpj || !pixChave || !pixTipo || !email || !telefone) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' })
    }

    // Verifica se o usuário já tem uma ONG
    const ongExiste = await prisma.ong.findUnique({ where: { userId: req.user.id } })
    if (ongExiste) {
      return res.status(409).json({ error: 'Este usuário já possui uma ONG cadastrada' })
    }

    const ong = await prisma.ong.create({
      data: {
        userId: req.user.id,
        nome,
        descricao,
        categoria,
        cidade,
        endereco,
        cnpj,
        pixChave,
        pixTipo,
        email,
        telefone,
        instagram: instagram || null,
        status: 'pendente',
      },
      select: ongSelect,
    })

    res.status(201).json(ong)
  } catch (err) {
    next(err)
  }
}

// PUT /api/ongs/:id  → Atualizar ONG (dono ou admin)
const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const ong = await prisma.ong.findUnique({ where: { id } })

    if (!ong) {
      return res.status(404).json({ error: 'ONG não encontrada' })
    }

    const ehDono = ong.userId === req.user.id
    const ehAdmin = req.user.tipo === 'admin'

    if (!ehDono && !ehAdmin) {
      return res.status(403).json({ error: 'Sem permissão para editar esta ONG' })
    }

    const { nome, descricao, categoria, cidade, endereco, pixChave, pixTipo, email, telefone, instagram } = req.body

    const atualizada = await prisma.ong.update({
      where: { id },
      data: { nome, descricao, categoria, cidade, endereco, pixChave, pixTipo, email, telefone, instagram },
      select: ongSelect,
    })

    res.json(atualizada)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/ongs/:id  → Remover ONG (admin)
const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    await prisma.ong.delete({ where: { id } })
    res.json({ message: 'ONG removida com sucesso' })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/ongs/:id/approve  → Aprovar ONG (admin)
const approve = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const ong = await prisma.ong.update({
      where: { id },
      data: { status: 'aprovado' },
      select: ongSelect,
    })
    res.json(ong)
  } catch (err) {
    next(err)
  }
}

// PATCH /api/ongs/:id/reject  → Rejeitar ONG (admin)
const reject = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const ong = await prisma.ong.update({
      where: { id },
      data: { status: 'rejeitado' },
      select: ongSelect,
    })
    res.json(ong)
  } catch (err) {
    next(err)
  }
}

// POST /api/ongs/:id/foto  → Upload foto (multipart/form-data)
const uploadFoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' })
    }

    const id = parseInt(req.params.id)
    const ong = await prisma.ong.findUnique({ where: { id } })

    if (!ong) {
      fs.unlinkSync(req.file.path)
      return res.status(404).json({ error: 'ONG não encontrada' })
    }

    const ehDono = ong.userId === req.user.id
    const ehAdmin = req.user.tipo === 'admin'

    if (!ehDono && !ehAdmin) {
      fs.unlinkSync(req.file.path)
      return res.status(403).json({ error: 'Sem permissão' })
    }

    // Remove foto antiga
    if (ong.foto) {
      const fotoAntiga = path.join(__dirname, '..', '..', 'uploads', path.basename(ong.foto))
      if (fs.existsSync(fotoAntiga)) {
        fs.unlinkSync(fotoAntiga)
      }
    }

    const fotoUrl = `${process.env.BASE_URL || 'http://localhost:3001'}/uploads/${req.file.filename}`

    const atualizada = await prisma.ong.update({
      where: { id },
      data: { foto: fotoUrl },
      select: ongSelect,
    })

    res.json({ url: fotoUrl, ong: atualizada })
  } catch (err) {
    next(err)
  }
}

module.exports = { getApproved, getAll, getMe, getPending, getById, create, update, remove, approve, reject, uploadFoto }
