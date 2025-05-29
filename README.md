# AutomaClinic.ia

Sistema de CRM para Clínicas Estéticas

## Configuração para Deploy

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Conta no EasyPanel

### Instalação Local

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie o arquivo `.env.example` para `.env` e preencha as variáveis de ambiente
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### Deploy no EasyPanel

1. Faça o push do código para seu repositório
2. Crie um novo projeto no EasyPanel
3. Conecte seu repositório
4. Configure as variáveis de ambiente
5. Defina o comando de build:
   ```
   npm install && npm run build
   ```
6. Defina o comando de start:
   ```
   npm start
   ```
7. Defina a porta para 3000 (ou a porta configurada no .env)
8. Faça o deploy

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm start` - Inicia o servidor de produção
- `npm run check` - Verifica os tipos TypeScript
