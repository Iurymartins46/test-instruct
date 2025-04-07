## Teste Técnico Backend Developer

<h2 id="desc">
    Descrição
</h2>

Solução para o [problema da instruct](https://github.com/instruct-br/teste-backend-remoto-2020-07)

<h2 id="prerequisites">
    Pré Requisitos
</h2>

- [Node 22](https://nodejs.org/en/download)
- [PostgreSQL](https://www.postgresql.org/download/)

---

<h2 id="running">
    Rodando
</h2>

Primeiro é precisso ter PostgreSQL instalado e configurado

0. Criar um arquivo `.env` com o conteúdo de `.env.example`

1. Instalar as dependencias

```bash
$ npm install
```

2. Executar as migrações do banco de dados

```bash
$ npm run migrate:dev
```

3. Executar as seeds para preencher o banco

```bash
$ npm run seed
```

4. Rodar o projeto

```
npm run start
```
