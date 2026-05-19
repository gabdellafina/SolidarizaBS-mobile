const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Prisma retorna Decimal como string — converte para number
const normalizeCampanha = (c) => ({
  ...c,
  meta: Number(c.meta),
  arrecadado: Number(c.arrecadado),
})

// GET /api/campaigns  → Todas campanhas, ou filtradas por ongId
const getAll = async (req, res, next) => {
  try {
    const { ongId } = req.query
    const where = {}
    if (ongId) where.ongId = parseInt(ongId)

    const campanhas = await prisma.campanha.findMany({
      where,
      orderBy: { criadoEm: 'desc' },
      include: { ong: { select: { id: true, nome: true, cidade: true, foto: true } } },
    })

    res.json(campanhas.map(normalizeCampanha))
  } catch (err) {
    next(err)
  }
}

// GET /api/campaigns/:id
const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const campanha = await prisma.campanha.findUnique({
      where: { id },
      include: { ong: { select: { id: true, nome: true, cidade: true, foto: true } } },
    })

    if (!campanha) {
      return res.status(404).json({ error: 'Campanha não encontrada' })
    }

    res.json(normalizeCampanha(campanha))
  } catch (err) {
    next(err)
  }
}

// POST /api/campaigns  → Criar campanha (auth, tipo=ong)
const create = async (req, res, next) => {
  try {
    const { ongId, titulo, descricao, meta } = req.body

    if (!ongId || !titulo || !descricao || !meta) {
      return res.status(400).json({ error: 'Campos obrigatórios: ongId, titulo, descricao, meta' })
    }

    // Verifica se a ONG pertence ao usuário logado
    const ong = await prisma.ong.findUnique({ where: { id: parseInt(ongId) } })
    if (!ong) {
      return res.status(404).json({ error: 'ONG não encontrada' })
    }

    if (ong.userId !== req.user.id) {
      return res.status(403).json({ error: 'Sem permissão para criar campanha nesta ONG' })
    }

    if (ong.status !== 'aprovado') {
      return res.status(403).json({ error: 'Sua ONG precisa estar aprovada para criar campanhas' })
    }

    const campanha = await prisma.campanha.create({
      data: {
        ongId: parseInt(ongId),
        titulo,
        descricao,
        meta: parseFloat(meta),
        arrecadado: 0,
        ativa: true,
      },
    })

    res.status(201).json(normalizeCampanha(campanha))
  } catch (err) {
    next(err)
  }
}

// PUT /api/campaigns/:id  → Atualizar campanha (dono ou admin)
const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const campanha = await prisma.campanha.findUnique({
      where: { id },
      include: { ong: { select: { userId: true } } },
    })

    if (!campanha) {
      return res.status(404).json({ error: 'Campanha não encontrada' })
    }

    const ehDono = campanha.ong.userId === req.user.id
    const ehAdmin = req.user.tipo === 'admin'

    if (!ehDono && !ehAdmin) {
      return res.status(403).json({ error: 'Sem permissão para editar esta campanha' })
    }

    const { titulo, descricao, meta } = req.body

    const atualizada = await prisma.campanha.update({
      where: { id },
      data: {
        titulo,
        descricao,
        meta: meta !== undefined ? parseFloat(meta) : undefined,
      },
    })

    res.json(normalizeCampanha(atualizada))
  } catch (err) {
    next(err)
  }
}

// DELETE /api/campaigns/:id  → Remover campanha (dono ou admin)
const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const campanha = await prisma.campanha.findUnique({
      where: { id },
      include: { ong: { select: { userId: true } } },
    })

    if (!campanha) {
      return res.status(404).json({ error: 'Campanha não encontrada' })
    }

    const ehDono = campanha.ong.userId === req.user.id
    const ehAdmin = req.user.tipo === 'admin'

    if (!ehDono && !ehAdmin) {
      return res.status(403).json({ error: 'Sem permissão para remover esta campanha' })
    }

    await prisma.campanha.delete({ where: { id } })
    res.json({ message: 'Campanha removida com sucesso' })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/campaigns/:id/toggle  → Ativar/desativar campanha
const toggleAtiva = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const campanha = await prisma.campanha.findUnique({
      where: { id },
      include: { ong: { select: { userId: true } } },
    })

    if (!campanha) {
      return res.status(404).json({ error: 'Campanha não encontrada' })
    }

    const ehDono = campanha.ong.userId === req.user.id
    const ehAdmin = req.user.tipo === 'admin'

    if (!ehDono && !ehAdmin) {
      return res.status(403).json({ error: 'Sem permissão' })
    }

    const atualizada = await prisma.campanha.update({
      where: { id },
      data: { ativa: !campanha.ativa },
    })

    res.json(normalizeCampanha(atualizada))
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getById, create, update, remove, toggleAtiva }
