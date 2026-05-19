const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// GET /api/reports/dashboard  → Stats gerais (admin)
const getDashboard = async (req, res, next) => {
  try {
    const [totalOngs, pendentes, aprovadas, rejeitadas, totalUsers, campanhas] = await Promise.all([
      prisma.ong.count(),
      prisma.ong.count({ where: { status: 'pendente' } }),
      prisma.ong.count({ where: { status: 'aprovado' } }),
      prisma.ong.count({ where: { status: 'rejeitado' } }),
      prisma.user.count(),
      prisma.campanha.findMany({ select: { meta: true, arrecadado: true, ativa: true } }),
    ])

    const totalCampanhas = campanhas.length
    const campanhasAtivas = campanhas.filter((c) => c.ativa).length
    const totalArrecadado = campanhas.reduce((sum, c) => sum + Number(c.arrecadado), 0)
    const totalMeta = campanhas.reduce((sum, c) => sum + Number(c.meta), 0)

    res.json({
      totalOngs,
      pendentes,
      aprovadas,
      rejeitadas,
      totalUsers,
      totalCampanhas,
      campanhasAtivas,
      totalArrecadado,
      totalMeta,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/reports/ongs-por-cidade  → Contagem de ONGs por cidade
const getOngsPorCidade = async (req, res, next) => {
  try {
    const resultado = await prisma.ong.groupBy({
      by: ['cidade'],
      _count: { cidade: true },
      orderBy: { _count: { cidade: 'desc' } },
    })

    const data = resultado.map((r) => ({ cidade: r.cidade, count: r._count.cidade }))
    res.json(data)
  } catch (err) {
    next(err)
  }
}

// GET /api/reports/ongs-por-categoria  → Contagem de ONGs por categoria
const getOngsPorCategoria = async (req, res, next) => {
  try {
    const resultado = await prisma.ong.groupBy({
      by: ['categoria'],
      _count: { categoria: true },
      orderBy: { _count: { categoria: 'desc' } },
    })

    const data = resultado.map((r) => ({ categoria: r.categoria, count: r._count.categoria }))
    res.json(data)
  } catch (err) {
    next(err)
  }
}

// GET /api/reports/campanhas  → Ranking de campanhas por arrecadação
const getCampanhasRanking = async (req, res, next) => {
  try {
    const campanhas = await prisma.campanha.findMany({
      where: { arrecadado: { gt: 0 } },
      orderBy: { arrecadado: 'desc' },
      include: { ong: { select: { id: true, nome: true, cidade: true } } },
    })

    const data = campanhas.map((c) => ({
      id: c.id,
      titulo: c.titulo,
      descricao: c.descricao,
      meta: Number(c.meta),
      arrecadado: Number(c.arrecadado),
      ativa: c.ativa,
      criadoEm: c.criadoEm,
      ongId: c.ongId,
      ongNome: c.ong.nome,
      ongCidade: c.ong.cidade,
    }))

    res.json(data)
  } catch (err) {
    next(err)
  }
}

// GET /api/reports/ong/:id  → Stats de uma ONG específica
const getStatsOng = async (req, res, next) => {
  try {
    const ongId = parseInt(req.params.id)
    const ong = await prisma.ong.findUnique({ where: { id: ongId } })

    if (!ong) {
      return res.status(404).json({ error: 'ONG não encontrada' })
    }

    const campanhas = await prisma.campanha.findMany({
      where: { ongId },
      select: { meta: true, arrecadado: true, ativa: true },
    })

    res.json({
      totalCampanhas: campanhas.length,
      campanhasAtivas: campanhas.filter((c) => c.ativa).length,
      totalArrecadado: campanhas.reduce((sum, c) => sum + Number(c.arrecadado), 0),
      totalMeta: campanhas.reduce((sum, c) => sum + Number(c.meta), 0),
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { getDashboard, getOngsPorCidade, getOngsPorCategoria, getCampanhasRanking, getStatsOng }
