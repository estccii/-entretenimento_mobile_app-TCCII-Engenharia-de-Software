import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
      }

      const result = await AuthService.register(name, email, password);

      return res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'Email já cadastrado') {
        return res.status(400).json({ message: error.message });
      }
      console.error('Erro ao registrar:', error);
      return res.status(500).json({ message: 'Erro interno' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }

      const result = await AuthService.login(email, password);

      return res.json(result);
    } catch (error: any) {
      if (error.message === 'Email ou senha inválidos') {
        return res.status(401).json({ message: error.message });
      }
      console.error('Erro ao logar:', error);
      return res.status(500).json({ message: 'Erro interno' });
    }
  }

}
