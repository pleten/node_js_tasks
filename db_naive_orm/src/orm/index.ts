import { Pool } from 'pg';
import SQL, {bulk, raw} from 'sql-template-tag';


export class Orm<T extends object, PK extends keyof T> {

    constructor(private table: string, private pool: Pool) {

    }

    async find(): Promise<T[]> {
        const { rows } = await this.pool.query(
            SQL`SELECT * FROM ${raw(this.table)}`,
        );
        return rows;
    }

    async findOne(id: T[PK]): Promise<T | null> {
        const { rows } = await this.pool.query(
            SQL`SELECT * FROM ${raw(this.table)} WHERE id = ${id}`,
        );
        console.log('findOne', rows);
        return rows[0] || null;
    }

    async save(entity: Omit<T, 'id'>): Promise<T> {
        const keys = Object.keys(entity);
        const values = Object.values(entity);
        const query = SQL`INSERT INTO ${raw(`${this.table}(${keys.join(', ')})`)}
        VALUES (${bulk(values.map(item => [item]))})
                RETURNING id, ${raw(keys.join(', '))}`;
        const { rows } = await this.pool.query(
            query,
        );
        return rows[0];
    }

    async update(id: T[PK], patch: Partial<T>): Promise<T> {
        const entries = Object.entries(patch);
        const setProps = entries.map(([key, value]) => {
            return `${key}=${( typeof value === 'number') ? value : `'${value}'`}`
        }).join(', ');
        console.log('setProps',setProps)
        const { rows } = await this.pool.query(
            SQL`
                UPDATE ${raw(this.table)}
                SET ${raw(setProps)}
                WHERE id = ${id}
                RETURNING *
            `,
        );
        return rows[0];
    }

    async delete(id: T[PK]): Promise<void> {
        await this.pool.query(
            SQL`
                DELETE FROM ${raw(this.table)}
                WHERE id = ${id}
            `,
        );
    }
}