const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SolidarizaBS API',
      version: '1.0.0',
      description: 'API REST da plataforma SolidarizaBS — centralização e promoção de ONGs da Baixada Santista.',
    },
    servers: [
      { url: 'http://localhost:3001/api', description: 'Desenvolvimento' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no login. Ex: Bearer eyJhbGci...',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id:         { type: 'integer', example: 1 },
            nome:       { type: 'string',  example: 'João Silva' },
            email:      { type: 'string',  example: 'joao@email.com' },
            tipo:       { type: 'string',  enum: ['admin', 'ong', 'doador'] },
            nascimento: { type: 'string',  format: 'date', nullable: true },
            criadoEm:   { type: 'string',  format: 'date-time' },
          },
        },
        Ong: {
          type: 'object',
          properties: {
            id:        { type: 'integer', example: 1 },
            userId:    { type: 'integer', example: 2 },
            nome:      { type: 'string',  example: 'Instituto Acolher Baixada' },
            descricao: { type: 'string',  example: 'Apoiamos crianças em situação de vulnerabilidade.' },
            categoria: { type: 'string',  example: 'Crianças e Adolescentes' },
            cidade:    { type: 'string',  example: 'Santos' },
            endereco:  { type: 'string',  example: 'Rua das Flores, 123' },
            cnpj:      { type: 'string',  example: '12.345.678/0001-90' },
            pixChave:  { type: 'string',  example: 'contato@ong.org' },
            pixTipo:   { type: 'string',  example: 'email' },
            status:    { type: 'string',  enum: ['pendente', 'aprovado', 'rejeitado'] },
            email:     { type: 'string',  example: 'contato@ong.org' },
            telefone:  { type: 'string',  example: '(13) 98765-4321' },
            instagram: { type: 'string',  example: '@ong', nullable: true },
            foto:      { type: 'string',  example: 'http://localhost:3001/uploads/foto.jpg', nullable: true },
            criadoEm:  { type: 'string',  format: 'date-time' },
          },
        },
        Campanha: {
          type: 'object',
          properties: {
            id:         { type: 'integer', example: 1 },
            ongId:      { type: 'integer', example: 1 },
            titulo:     { type: 'string',  example: 'Material Escolar 2025' },
            descricao:  { type: 'string',  example: 'Arrecadação de material escolar para 200 crianças.' },
            meta:       { type: 'number',  example: 15000 },
            arrecadado: { type: 'number',  example: 9800 },
            ativa:      { type: 'boolean', example: true },
            criadoEm:   { type: 'string',  format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem de erro' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth',       description: 'Autenticação e sessão' },
      { name: 'ONGs',       description: 'Cadastro e gestão de ONGs' },
      { name: 'Campanhas',  description: 'Campanhas de arrecadação' },
      { name: 'Usuários',   description: 'Gestão de usuários (admin)' },
      { name: 'Relatórios', description: 'Dashboards e relatórios (admin)' },
    ],
    paths: {
      // ─── AUTH ───────────────────────────────────────────────────────────────
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Registrar novo usuário',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nome', 'email', 'senha', 'tipo'],
                  properties: {
                    nome:       { type: 'string', example: 'João Silva' },
                    email:      { type: 'string', example: 'joao@email.com' },
                    senha:      { type: 'string', example: 'senha123' },
                    tipo:       { type: 'string', enum: ['ong', 'doador'], example: 'doador' },
                    nascimento: { type: 'string', format: 'date', example: '1990-05-15' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Usuário criado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user:  { $ref: '#/components/schemas/User' },
                      token: { type: 'string', example: 'eyJhbGci...' },
                    },
                  },
                },
              },
            },
            400: { description: 'Campos inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            409: { description: 'E-mail já cadastrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'senha'],
                  properties: {
                    email: { type: 'string', example: 'admin@solidarizabs.com.br' },
                    senha: { type: 'string', example: 'admin123' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Login realizado',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      user:  { $ref: '#/components/schemas/User' },
                      token: { type: 'string', example: 'eyJhbGci...' },
                    },
                  },
                },
              },
            },
            401: { description: 'Credenciais inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Logout realizado', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Retorna dados do usuário logado',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Usuário encontrado', content: { 'application/json': { schema: { type: 'object', properties: { user: { $ref: '#/components/schemas/User' } } } } } },
            401: { description: 'Não autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },

      // ─── ONGs ───────────────────────────────────────────────────────────────
      '/ongs': {
        get: {
          tags: ['ONGs'],
          summary: 'Lista ONGs aprovadas (público)',
          parameters: [
            { in: 'query', name: 'cidade',    schema: { type: 'string' }, description: 'Filtrar por cidade' },
            { in: 'query', name: 'categoria', schema: { type: 'string' }, description: 'Filtrar por categoria' },
            { in: 'query', name: 'search',    schema: { type: 'string' }, description: 'Busca por nome ou descrição' },
          ],
          responses: {
            200: { description: 'Lista de ONGs', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Ong' } } } } },
          },
        },
        post: {
          tags: ['ONGs'],
          summary: 'Cadastrar ONG (requer tipo=ong)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nome', 'descricao', 'categoria', 'cidade', 'endereco', 'cnpj', 'pixChave', 'pixTipo', 'email', 'telefone'],
                  properties: {
                    nome:      { type: 'string', example: 'Minha ONG' },
                    descricao: { type: 'string', example: 'Descrição da ONG' },
                    categoria: { type: 'string', example: 'Educação' },
                    cidade:    { type: 'string', example: 'Santos' },
                    endereco:  { type: 'string', example: 'Rua A, 100' },
                    cnpj:      { type: 'string', example: '00.000.000/0001-00' },
                    pixChave:  { type: 'string', example: 'email@ong.org' },
                    pixTipo:   { type: 'string', enum: ['email', 'cpf', 'cnpj', 'telefone', 'aleatoria'] },
                    email:     { type: 'string', example: 'contato@ong.org' },
                    telefone:  { type: 'string', example: '(13) 91234-5678' },
                    instagram: { type: 'string', example: '@ong' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'ONG criada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ong' } } } },
            403: { description: 'Sem permissão ou ONG já existente', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/ongs/me': {
        get: {
          tags: ['ONGs'],
          summary: 'Retorna a ONG do usuário logado (requer tipo=ong)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'ONG encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ong' } } } },
            404: { description: 'ONG não encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/ongs/all': {
        get: {
          tags: ['ONGs'],
          summary: 'Lista todas as ONGs — todos os status (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista completa', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Ong' } } } } },
          },
        },
      },
      '/ongs/admin/pending': {
        get: {
          tags: ['ONGs'],
          summary: 'Lista ONGs com status pendente (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de pendentes', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Ong' } } } } },
          },
        },
      },
      '/ongs/{id}': {
        get: {
          tags: ['ONGs'],
          summary: 'Detalhes de uma ONG com campanhas ativas (público)',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'ONG encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ong' } } } },
            404: { description: 'Não encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        put: {
          tags: ['ONGs'],
          summary: 'Atualizar dados da ONG (dono ou admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    nome:      { type: 'string' },
                    descricao: { type: 'string' },
                    categoria: { type: 'string' },
                    cidade:    { type: 'string' },
                    endereco:  { type: 'string' },
                    pixChave:  { type: 'string' },
                    pixTipo:   { type: 'string' },
                    email:     { type: 'string' },
                    telefone:  { type: 'string' },
                    instagram: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'ONG atualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ong' } } } },
            403: { description: 'Sem permissão', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        delete: {
          tags: ['ONGs'],
          summary: 'Remover ONG (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'ONG removida', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
          },
        },
      },
      '/ongs/{id}/foto': {
        post: {
          tags: ['ONGs'],
          summary: 'Upload da foto da ONG (dono ou admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: { file: { type: 'string', format: 'binary' } },
                },
              },
            },
          },
          responses: {
            200: { description: 'Foto salva', content: { 'application/json': { schema: { type: 'object', properties: { url: { type: 'string' } } } } } },
          },
        },
      },
      '/ongs/{id}/approve': {
        patch: {
          tags: ['ONGs'],
          summary: 'Aprovar ONG (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'ONG aprovada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ong' } } } },
          },
        },
      },
      '/ongs/{id}/reject': {
        patch: {
          tags: ['ONGs'],
          summary: 'Rejeitar ONG (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'ONG rejeitada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Ong' } } } },
          },
        },
      },

      // ─── CAMPANHAS ──────────────────────────────────────────────────────────
      '/campaigns': {
        get: {
          tags: ['Campanhas'],
          summary: 'Lista campanhas (público). Filtre por ?ongId=X',
          parameters: [
            { in: 'query', name: 'ongId', schema: { type: 'integer' }, description: 'ID da ONG para filtrar campanhas' },
          ],
          responses: {
            200: { description: 'Lista de campanhas', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Campanha' } } } } },
          },
        },
        post: {
          tags: ['Campanhas'],
          summary: 'Criar campanha (requer tipo=ong e ONG aprovada)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['ongId', 'titulo', 'descricao', 'meta'],
                  properties: {
                    ongId:     { type: 'integer', example: 1 },
                    titulo:    { type: 'string',  example: 'Campanha de Inverno' },
                    descricao: { type: 'string',  example: 'Arrecadação de agasalhos' },
                    meta:      { type: 'number',  example: 5000 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Campanha criada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Campanha' } } } },
            403: { description: 'ONG não aprovada ou sem permissão', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/campaigns/{id}': {
        get: {
          tags: ['Campanhas'],
          summary: 'Detalhes de uma campanha (público)',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Campanha encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Campanha' } } } },
            404: { description: 'Não encontrada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        put: {
          tags: ['Campanhas'],
          summary: 'Atualizar campanha (dono ou admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    titulo:    { type: 'string' },
                    descricao: { type: 'string' },
                    meta:      { type: 'number' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Campanha atualizada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Campanha' } } } },
          },
        },
        delete: {
          tags: ['Campanhas'],
          summary: 'Remover campanha (dono ou admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Removida com sucesso', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
          },
        },
      },
      '/campaigns/{id}/toggle': {
        patch: {
          tags: ['Campanhas'],
          summary: 'Ativar / desativar campanha (dono ou admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Status alternado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Campanha' } } } },
          },
        },
      },

      // ─── USUÁRIOS ───────────────────────────────────────────────────────────
      '/users': {
        get: {
          tags: ['Usuários'],
          summary: 'Lista todos os usuários (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de usuários', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } } },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Usuários'],
          summary: 'Detalhes de um usuário (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Usuário encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          },
        },
        delete: {
          tags: ['Usuários'],
          summary: 'Remover usuário (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Usuário removido', content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' } } } } } },
          },
        },
      },

      // ─── RELATÓRIOS ─────────────────────────────────────────────────────────
      '/reports/dashboard': {
        get: {
          tags: ['Relatórios'],
          summary: 'Stats gerais da plataforma (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Estatísticas',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      totalOngs:       { type: 'integer' },
                      pendentes:       { type: 'integer' },
                      aprovadas:       { type: 'integer' },
                      rejeitadas:      { type: 'integer' },
                      totalUsers:      { type: 'integer' },
                      totalCampanhas:  { type: 'integer' },
                      campanhasAtivas: { type: 'integer' },
                      totalArrecadado: { type: 'number' },
                      totalMeta:       { type: 'number' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/reports/ongs-por-cidade': {
        get: {
          tags: ['Relatórios'],
          summary: 'Contagem de ONGs por cidade (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Dados agrupados', content: { 'application/json': { schema: { type: 'array', items: { type: 'object', properties: { cidade: { type: 'string' }, count: { type: 'integer' } } } } } } },
          },
        },
      },
      '/reports/ongs-por-categoria': {
        get: {
          tags: ['Relatórios'],
          summary: 'Contagem de ONGs por categoria (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Dados agrupados', content: { 'application/json': { schema: { type: 'array', items: { type: 'object', properties: { categoria: { type: 'string' }, count: { type: 'integer' } } } } } } },
          },
        },
      },
      '/reports/campanhas': {
        get: {
          tags: ['Relatórios'],
          summary: 'Ranking de campanhas por arrecadação (admin)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Ranking', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Campanha' } } } } },
          },
        },
      },
      '/reports/ong/{id}': {
        get: {
          tags: ['Relatórios'],
          summary: 'Stats de campanhas de uma ONG específica (ong ou admin)',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
          responses: {
            200: {
              description: 'Stats da ONG',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      totalCampanhas:  { type: 'integer' },
                      campanhasAtivas: { type: 'integer' },
                      totalArrecadado: { type: 'number' },
                      totalMeta:       { type: 'number' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
}

const swaggerSpec = swaggerJsdoc(options)

const setupSwagger = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'SolidarizaBS API Docs',
    customCss: '.swagger-ui .topbar { background-color: #1d4ed8; }',
  }))

  // Endpoint que retorna o JSON do spec (útil para Postman/Insomnia)
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}

module.exports = setupSwagger
