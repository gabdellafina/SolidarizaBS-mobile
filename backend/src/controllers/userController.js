const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// GET /api/users  → Lista todos os usuários (admin)
const getAll = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        nascimento: true,
        criadoEm: true,
      },
      orderBy: { criadoEm: 'desc' },
    })

    res.json(users)
  } catch (err) {
    next(err)
  }
}

// GET /api/users/:id  → Detalhes de um usuário (admin)
const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        nascimento: true,
        criadoEm: true,
        ong: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json(user)
  } catch (err) {
    next(err)
  }
}

// DELETE /api/users/:id  → Remover usuário (admin)
const remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)

    if (req.user.id === id) {
      return res.status(400).json({ error: 'Não é possível remover sua própria conta' })
    }

    await prisma.user.delete({ where: { id } })
    res.json({ message: 'Usuário removido com sucesso' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getById, remove }
