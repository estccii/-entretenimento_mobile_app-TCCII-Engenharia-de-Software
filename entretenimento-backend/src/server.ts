import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import itemRoutes from './routes/item.routes';
import authRoutes from './routes/auth.routes';
import { pool } from './database/connection';

const app = express();

app.use(cors());
app.use(express.json());

async function runMigrations() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        google_id VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE
    `).catch(() => {});

    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        categoria VARCHAR(100),
        icone VARCHAR(50),
        temporada INTEGER,
        episodio INTEGER,
        tempo VARCHAR(50),
        tipo_lista VARCHAR(20),
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      ALTER TABLE items
      ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    `).catch(() => {});
  } catch (err) {
    console.error('Erro ao rodar migrations:', err);
  }
}

runMigrations();

app.use('/auth', authRoutes);
app.use('/items', itemRoutes);

app.get('/', (req, res) => {
  return res.json({
    message: 'API Watch and Save funcionando'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
