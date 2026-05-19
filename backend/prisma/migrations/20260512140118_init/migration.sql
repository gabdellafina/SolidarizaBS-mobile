-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('admin', 'ong', 'doador');

-- CreateEnum
CREATE TYPE "StatusOng" AS ENUM ('pendente', 'aprovado', 'rejeitado');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" "TipoUsuario" NOT NULL DEFAULT 'doador',
    "nascimento" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ongs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "pix_chave" TEXT NOT NULL,
    "pix_tipo" TEXT NOT NULL,
    "status" "StatusOng" NOT NULL DEFAULT 'pendente',
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "instagram" TEXT,
    "foto" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ongs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campanhas" (
    "id" SERIAL NOT NULL,
    "ong_id" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "meta" DECIMAL(12,2) NOT NULL,
    "arrecadado" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campanhas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ongs_user_id_key" ON "ongs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ongs_cnpj_key" ON "ongs"("cnpj");

-- AddForeignKey
ALTER TABLE "ongs" ADD CONSTRAINT "ongs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campanhas" ADD CONSTRAINT "campanhas_ong_id_fkey" FOREIGN KEY ("ong_id") REFERENCES "ongs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
