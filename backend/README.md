# SolidarizaBS — Backend

API REST da plataforma SolidarizaBS. Construída com Node.js, Express e Prisma ORM, conectada a um banco PostgreSQL.

---

## Pré-requisitos

- Node.js v18+
- npm v9+
- PostgreSQL (local ou Railway)

---

## Instalação

```bash
cd backend
npm install
```

---

## Configuração

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

| Variável        | Descrição                                              | Exemplo                                          |
|-----------------|--------------------------------------------------------|--------------------------------------------------|
| `DATABASE_URL`  | String de conexão PostgreSQL                           | `postgresql://user:pass@host:5432/solidarizabs`  |
| `JWT_SECRET`    | Segredo para assinar tokens JWT                        | string longa e aleatória                         |
| `JWT_EXPIRES_IN`| Expiração do token                                     | `7d`                                             |
| `PORT`          | Porta do servidor                                      | `3001`                                           |
| `BASE_URL`      | URL base do servidor (usado nos links de foto)         | `http://localhost:3001`                          |
| `FRONTEND_URL`  | URL do frontend (CORS)                                 | `http://localhost:5173`                          |

---

## Banco de dados

### Criar as tabelas (migration)

```bash
npm run db:migrate
```

### Gerar o Prisma Client

```bash
npm run db:generate
```

### Popular com dados iniciais

```bash
npm run db:seed
```

Cria os seguintes usuários de teste:

| Perfil | Email | Senha |
|--------|-------|-------|
| Admin  | `admin@solidarizabs.com.br` | `admin123` |
| ONG    | `contato@acolherbaixa.org`  | `ong123`   |
| Doador | `doador@email.com`          | `doador123`|

### Resetar o banco

```bash
npm run db:reset
```

### Abrir o Prisma Studio (interface visual)

```bash
npm run db:studio
```

---

## Rodar o servidor

```bash
# Desenvolvimento (nodemon — reinicia automaticamente)
npm run dev

# Produção
npm start
```

Servidor disponível em `http://localhost:3001`

---

## Documentação da API (Swagger)

Acesse **http://localhost:3001/api/docs** com o servidor rodando.

Para testar endpoints protegidos:
1. Chame `POST /api/auth/login` e copie o `token` da resposta
2. Clique em **Authorize** no topo do Swagger
3. Cole o token e clique em **Authorize**

O JSON do spec também está disponível em `GET /api/docs.json` (importável no Postman/Insomnia).

---

## Endpoints

Base: `http://localhost:3001/api`

### Auth

| Método | Rota             | Acesso     | Descrição                        |
|--------|------------------|------------|----------------------------------|
| POST   | `/auth/register` | Público    | Cria conta (tipo: ong ou doador) |
| POST   | `/auth/login`    | Público    | Login — retorna JWT              |
| POST   | `/auth/logout`   | Auth       | Logout                           |
| GET    | `/auth/me`       | Auth       | Dados do usuário logado          |

### ONGs

| Método | Rota                    | Acesso     | Descrição                            |
|--------|-------------------------|------------|--------------------------------------|
| GET    | `/ongs`                 | Público    | Lista ONGs aprovadas (filtros: cidade, categoria, search) |
| GET    | `/ongs/:id`             | Público    | Detalhes da ONG + campanhas ativas   |
| GET    | `/ongs/me`              | ONG        | ONG do usuário logado                |
| POST   | `/ongs`                 | ONG        | Cadastrar ONG (status: pendente)     |
| PUT    | `/ongs/:id`             | ONG/Admin  | Atualizar dados da ONG               |
| POST   | `/ongs/:id/foto`        | ONG/Admin  | Upload de foto (multipart/form-data) |
| GET    | `/ongs/all`             | Admin      | Todas as ONGs (todos os status)      |
| GET    | `/ongs/admin/pending`   | Admin      | Somente ONGs pendentes               |
| PATCH  | `/ongs/:id/approve`     | Admin      | Aprovar ONG                          |
| PATCH  | `/ongs/:id/reject`      | Admin      | Rejeitar ONG                         |
| DELETE | `/ongs/:id`             | Admin      | Remover ONG                          |

### Campanhas

| Método | Rota                       | Acesso     | Descrição                         |
|--------|----------------------------|------------|-----------------------------------|
| GET    | `/campaigns`               | Público    | Lista campanhas (filtro: ?ongId=) |
| GET    | `/campaigns/:id`           | Público    | Detalhes de uma campanha          |
| POST   | `/campaigns`               | ONG        | Criar campanha (ONG aprovada)     |
| PUT    | `/campaigns/:id`           | ONG/Admin  | Atualizar campanha                |
| PATCH  | `/campaigns/:id/toggle`    | ONG/Admin  | Ativar / desativar campanha       |
| DELETE | `/campaigns/:id`           | ONG/Admin  | Remover campanha                  |

### Usuários

| Método | Rota          | Acesso | Descrição               |
|--------|---------------|--------|-------------------------|
| GET    | `/users`      | Admin  | Lista todos os usuários |
| GET    | `/users/:id`  | Admin  | Detalhes de um usuário  |
| DELETE | `/users/:id`  | Admin  | Remover usuário         |

### Relatórios

| Método | Rota                          | Acesso     | Descrição                         |
|--------|-------------------------------|------------|-----------------------------------|
| GET    | `/reports/dashboard`          | Admin      | Stats gerais da plataforma        |
| GET    | `/reports/ongs-por-cidade`    | Admin      | Contagem de ONGs por cidade       |
| GET    | `/reports/ongs-por-categoria` | Admin      | Contagem de ONGs por categoria    |
| GET    | `/reports/campanhas`          | Admin      | Ranking de campanhas por arrecadação |
| GET    | `/reports/ong/:id`            | ONG/Admin  | Stats de campanhas de uma ONG     |

---

## Modelo de dados

```
User
  id, nome, email, senha (hash), tipo (admin|ong|doador), nascimento, criadoEm

Ong
  id, userId (→ User), nome, descricao, categoria, cidade, endereco
  cnpj, pixChave, pixTipo, status (pendente|aprovado|rejeitado)
  email, telefone, instagram, foto, criadoEm

Campanha
  id, ongId (→ Ong), titulo, descricao, meta, arrecadado, ativa, criadoEm
```

Relações:
- `User 1:1 Ong` — cada usuário tipo `ong` tem exatamente uma ONG
- `Ong 1:N Campanha` — uma ONG pode ter várias campanhas
- Deleção em cascata: remover `User` remove a `Ong`; remover `Ong` remove todas as `Campanhas`

---

## Estrutura de pastas

```
backend/
├── prisma/
│   ├── schema.prisma       # Modelos do banco de dados
│   ├── seed.js             # Dados iniciais
│   └── migrations/         # Histórico de migrations (gerado pelo Prisma)
├── src/
│   ├── controllers/        # Lógica de negócio por recurso
│   │   ├── authController.js
│   │   ├── ongController.js
│   │   ├── campanhaController.js
│   │   ├── userController.js
│   │   └── relatorioController.js
│   ├── middlewares/
│   │   ├── auth.js         # Verifica e decodifica JWT
│   │   ├── roles.js        # Controle de acesso por perfil
│   │   ├── upload.js       # Multer (fotos, max 5 MB, JPEG/PNG/WebP)
│   │   └── errorHandler.js # Trata erros Prisma, Multer e genéricos
│   ├── routes/             # Define as rotas e aplica middlewares
│   │   ├── auth.js
│   │   ├── ongs.js
│   │   ├── campanhas.js
│   │   ├── users.js
│   │   └── relatorios.js
│   ├── swagger.js          # Configuração do Swagger UI
│   ├── app.js              # Instância do Express + middlewares globais
│   └── server.js           # Ponto de entrada (listen)
├── uploads/                # Fotos de ONGs (servidas em /uploads/*)
├── .env.example
├── .gitignore
└── package.json
```

---

## Scripts

| Comando              | O que faz                                       |
|----------------------|-------------------------------------------------|
| `npm run dev`        | Inicia com nodemon (reinício automático)        |
| `npm start`          | Inicia em modo produção                         |
| `npm run db:migrate` | Aplica migrations no banco                      |
| `npm run db:generate`| Gera o Prisma Client                            |
| `npm run db:seed`    | Popula o banco com dados iniciais               |
| `npm run db:studio`  | Abre o Prisma Studio (interface visual)         |
| `npm run db:reset`   | Reseta o banco e re-executa o seed              |
