CREATE TABLE IF NOT EXISTS "Projeto" (
	"id" serial NOT NULL UNIQUE,
	"responsavel" varchar(255) NOT NULL,
	"data_inicio" date NOT NULL,
	"data_fim" date NOT NULL,
	"descricao" varchar(255) NOT NULL,
	"cliente" varchar(255) NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Tarefa" (
	"id" serial NOT NULL UNIQUE,
	"nome" varchar(255) NOT NULL,
	"horas" bigint NOT NULL,
	"funcionario_responsavel" varchar(255) NOT NULL,
	"projeto" bigint NOT NULL,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Cliente" (
	"CNPJ" serial NOT NULL UNIQUE,
	"nome" varchar(255) NOT NULL,
	"endereco" varchar(255) NOT NULL,
	"telefone" varchar(255) NOT NULL,
	"responsavel" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	PRIMARY KEY ("CNPJ")
);

CREATE TABLE IF NOT EXISTS "Funcionario" (
	"matricula" serial NOT NULL UNIQUE,
	"nome" varchar(255) NOT NULL,
	"cargo" varchar(255) NOT NULL,
	"telefone" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"tarefa" bigint NOT NULL,
	PRIMARY KEY ("matricula")
);

ALTER TABLE "Projeto" ADD CONSTRAINT "Projeto_fk5" FOREIGN KEY ("cliente") REFERENCES "Cliente"("CNPJ");
ALTER TABLE "Tarefa" ADD CONSTRAINT "Tarefa_fk4" FOREIGN KEY ("projeto") REFERENCES "Projeto"("id");

ALTER TABLE "Funcionario" ADD CONSTRAINT "Funcionario_fk5" FOREIGN KEY ("tarefa") REFERENCES "Tarefa"("id");