import { pool } from '../database/connection';

export class ItemService {
    static async create(titulo: string, user_id: number, categoria?: string, icone?: string, temporada?: number, episodio?: number, tempo?: string, tipo_lista?: string) {
        const result = await pool.query(
            `
      INSERT INTO items (titulo, categoria, icone, temporada, episodio, tempo, tipo_lista, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
            [titulo, categoria || null, icone || null, temporada ?? null, episodio ?? null, tempo || null, tipo_lista || null, user_id]
        );

        return result.rows[0];
    }

    static async findAll(user_id: number, tipo_lista?: string) {
        let query = `SELECT * FROM items WHERE user_id = $1`;
        const params: any[] = [user_id];

        if (tipo_lista) {
            query += ` AND tipo_lista = $2`;
            params.push(tipo_lista);
        }

        query += ` ORDER BY id DESC`;

        const result = await pool.query(query, params);
        return result.rows;
    }

    static async findById(id: number) {
        const result = await pool.query(
            `
    SELECT *
    FROM items
    WHERE id = $1
    `,
            [id]
        );

        return result.rows[0];
    }

    static async update(
        id: number,
        user_id: number,
        titulo: string,
        categoria?: string,
        icone?: string,
        temporada?: number,
        episodio?: number,
        tempo?: string
    ) {
        const result = await pool.query(
            `
    UPDATE items
    SET titulo = $1, categoria = $2, icone = $3, temporada = $4, episodio = $5, tempo = $6
    WHERE id = $7 AND user_id = $8
    RETURNING *
    `,
            [titulo, categoria || null, icone || null, temporada ?? null, episodio ?? null, tempo || null, id, user_id]
        );

        return result.rows[0];
    }

    static async delete(id: number, user_id: number) {
        await pool.query(
            `
    DELETE FROM items
    WHERE id = $1 AND user_id = $2
    `,
            [id, user_id]
        );
    }
}
