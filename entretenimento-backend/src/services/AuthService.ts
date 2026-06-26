import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { pool } from '../database/connection';

const JWT_SECRET = process.env.JWT_SECRET || 'watch-and-save-secret-key-2026';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  static async register(name: string, email: string, password: string) {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return { user, token };
  }

  static async login(email: string, password: string) {
    const result = await pool.query(
      'SELECT id, name, email, password, created_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new Error('Email ou senha inválidos');
    }

    const user = result.rows[0];

    if (!user.password) {
      throw new Error('Esta conta usa login com Google. Faça login com o Google.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Email ou senha inválidos');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  static async loginWithGoogle(idToken: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Token do Google inválido');
    }

    const { email, name, sub: googleId } = payload;

    let result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE google_id = $1',
      [googleId]
    );

    if (result.rows.length === 0 && email) {
      result = await pool.query(
        'SELECT id, name, email, created_at FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length > 0) {
        await pool.query(
          'UPDATE users SET google_id = $1 WHERE id = $2',
          [googleId, result.rows[0].id]
        );
      }
    }

    let user;
    if (result.rows.length === 0) {
      const newUser = await pool.query(
        `INSERT INTO users (name, email, google_id)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, created_at`,
        [name || 'Usuário', email, googleId]
      );
      user = newUser.rows[0];
    } else {
      user = result.rows[0];
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return { user, token };
  }
}
