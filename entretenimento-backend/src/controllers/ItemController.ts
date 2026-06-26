import { Response } from 'express';
import { ItemService } from '../services/ItemService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class ItemController {
    static async create(req: AuthenticatedRequest, res: Response) {
        try {
            const { titulo, categoria, icone, temporada, episodio, tempo, tipo_lista } = req.body;
            const user_id = req.userId!;

            if (!titulo) {
                return res.status(400).json({
                    message: 'Título é obrigatório',
                });
            }

            const item = await ItemService.create(titulo, user_id, categoria, icone, temporada, episodio, tempo, tipo_lista);

            return res.status(201).json(item);
        } catch (error) {
            console.error('Erro ao criar item:', error);
            return res.status(500).json({
                message: 'Erro interno',
            });
        }
    }

    static async findAll(req: AuthenticatedRequest, res: Response) {
        try {
            const user_id = req.userId!;
            const tipo_lista = req.query.tipo_lista as string | undefined;
            const items = await ItemService.findAll(user_id, tipo_lista);

            return res.json(items);
        } catch (error) {
            console.error('Erro ao listar itens:', error);
            return res.status(500).json({
                message: 'Erro interno',
            });
        }
    }

    static async update(req: AuthenticatedRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const user_id = req.userId!;
            const { titulo, categoria, icone, temporada, episodio, tempo } = req.body;

            if (!titulo) {
                return res.status(400).json({
                    message: 'Título é obrigatório'
                });
            }

            const item = await ItemService.update(id, user_id, titulo, categoria, icone, temporada, episodio, tempo);

            return res.json(item);
        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao atualizar item'
            });
        }
    }

    static async delete(req: AuthenticatedRequest, res: Response) {
        try {
            const id = Number(req.params.id);
            const user_id = req.userId!;

            await ItemService.delete(id, user_id);

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({
                message: 'Erro ao excluir item'
            });
        }
    }
}
