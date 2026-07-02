## Requisitos

Antes de executar o projeto, tenha instalado:

- Node.js
- npm
- PostgreSQL

### Instale as dependências

```bash
rode o comando npm install na pasta do aplicativo 'entretenimento-app' e na 'entretenimento-backend'
```

### Rode a aplicação

npx expo start na pasta 'entretenimento-app'
npm run dev na pasta 'entretenimento-backend'

### Configurações

coloque o IPv4 da máquina em src/services/api.ts para o funcionamento do aplicativo 
crie um arquivo .env na raiz do backend, exemplo:

PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sehnaBancoDeDados
DB_NAME=nomeBancoDeDados

JWT_SECRET=watch-and-save-secret-key-ano
