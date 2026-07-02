### Requisitos

Antes de executar o projeto, tenha instalado:

- Node.js
- npm
- PostgreSQL

### Instale as dependências

rode o comando npm install na pasta do aplicativo 'entretenimento-app' e na 'entretenimento-backend'

### Rode a aplicação

npx expo start na pasta 'entretenimento-app' <br/>
npm run dev na pasta 'entretenimento-backend'

### Configurações

coloque o IPv4 da máquina em src/services/api.ts para o funcionamento do aplicativo <br/>
crie um arquivo .env na raiz do backend, exemplo:

PORT=3000

DB_HOST=localhost <br/>
DB_PORT=5432 <br/>
DB_USER=postgres <br/>
DB_PASSWORD=sehnaBancoDeDados <br/>
DB_NAME=nomeBancoDeDados <br/>

JWT_SECRET=watch-and-save-secret-key-ano
