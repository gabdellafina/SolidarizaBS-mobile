const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed...')

  // Admin
  const senhaHash = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@solidarizabs.com.br' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@solidarizabs.com.br',
      senha: senhaHash,
      tipo: 'admin',
    },
  })

  // Doador
  const senhaDoador = await bcrypt.hash('doador123', 10)
  await prisma.user.upsert({
    where: { email: 'doador@email.com' },
    update: {},
    create: {
      nome: 'João Doador',
      email: 'doador@email.com',
      senha: senhaDoador,
      tipo: 'doador',
      nascimento: new Date('1990-05-15'),
    },
  })

  // ONG 1
  const senhaOng1 = await bcrypt.hash('ong123', 10)
  const userOng1 = await prisma.user.upsert({
    where: { email: 'contato@acolherbaixa.org' },
    update: {},
    create: {
      nome: 'Maria Responsável',
      email: 'contato@acolherbaixa.org',
      senha: senhaOng1,
      tipo: 'ong',
    },
  })

  await prisma.ong.upsert({
    where: { cnpj: '12.345.678/0001-90' },
    update: {},
    create: {
      userId: userOng1.id,
      nome: 'Instituto Acolher Baixada',
      descricao: 'Apoiamos crianças e adolescentes em situação de vulnerabilidade social na Baixada Santista, oferecendo educação, esporte e cultura.',
      categoria: 'Crianças e Adolescentes',
      cidade: 'Santos',
      endereco: 'Rua das Flores, 123 - Vila Belmiro',
      cnpj: '12.345.678/0001-90',
      pixChave: 'contato@acolherbaixa.org',
      pixTipo: 'email',
      status: 'aprovado',
      email: 'contato@acolherbaixa.org',
      telefone: '(13) 98765-4321',
      instagram: '@acolherbaixa',
      campanhas: {
        create: [
          {
            titulo: 'Material Escolar 2025',
            descricao: 'Arrecadação de material escolar para 200 crianças carentes das escolas públicas de Santos.',
            meta: 15000,
            arrecadado: 9800,
            ativa: true,
          },
          {
            titulo: 'Reforma da Sala de Aulas',
            descricao: 'Reforma completa do espaço educacional para melhor atendimento das crianças.',
            meta: 25000,
            arrecadado: 25000,
            ativa: false,
          },
        ],
      },
    },
  })

  // ONG 2
  const senhaOng2 = await bcrypt.hash('ong123', 10)
  const userOng2 = await prisma.user.upsert({
    where: { email: 'contato@vidaverde.org' },
    update: {},
    create: {
      nome: 'Carlos Verde',
      email: 'contato@vidaverde.org',
      senha: senhaOng2,
      tipo: 'ong',
    },
  })

  await prisma.ong.upsert({
    where: { cnpj: '98.765.432/0001-10' },
    update: {},
    create: {
      userId: userOng2.id,
      nome: 'Vida Verde Sustentável',
      descricao: 'Promovemos a educação ambiental e projetos de sustentabilidade na região da Baixada Santista.',
      categoria: 'Meio Ambiente',
      cidade: 'São Vicente',
      endereco: 'Av. Presidente Wilson, 500 - Centro',
      cnpj: '98.765.432/0001-10',
      pixChave: '98765432000110',
      pixTipo: 'cnpj',
      status: 'aprovado',
      email: 'contato@vidaverde.org',
      telefone: '(13) 91234-5678',
      instagram: '@vidaverdesustentavel',
      campanhas: {
        create: [
          {
            titulo: 'Plantio de 1000 Árvores',
            descricao: 'Projeto de reflorestamento da orla de São Vicente com espécies nativas.',
            meta: 8000,
            arrecadado: 3200,
            ativa: true,
          },
        ],
      },
    },
  })

  // ONG pendente
  const senhaOng3 = await bcrypt.hash('ong123', 10)
  const userOng3 = await prisma.user.upsert({
    where: { email: 'contato@amarelafeliz.org' },
    update: {},
    create: {
      nome: 'Ana Responsável',
      email: 'contato@amarelafeliz.org',
      senha: senhaOng3,
      tipo: 'ong',
    },
  })

  await prisma.ong.upsert({
    where: { cnpj: '11.222.333/0001-44' },
    update: {},
    create: {
      userId: userOng3.id,
      nome: 'Amarela Feliz',
      descricao: 'Cuidamos de idosos em situação de abandono na Baixada Santista.',
      categoria: 'Idosos',
      cidade: 'Guarujá',
      endereco: 'Rua da Saudade, 77 - Centro',
      cnpj: '11.222.333/0001-44',
      pixChave: '(13) 97777-8888',
      pixTipo: 'telefone',
      status: 'pendente',
      email: 'contato@amarelafeliz.org',
      telefone: '(13) 97777-8888',
    },
  })

  console.log('Seed concluído!')
  console.log('Admin: admin@solidarizabs.com.br / admin123')
  console.log('ONG:   contato@acolherbaixa.org / ong123')
  console.log('Doador: doador@email.com / doador123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
