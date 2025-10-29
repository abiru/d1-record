export abstract class BaseModel<T> {
  constructor(public table: string, public db: D1Database) {}

  async all(): Promise<T[]> {
    const { results } = await this.db.prepare(`SELECT * FROM ${this.table}`).all<T>();
    return results;
  }

  async find(id: number): Promise<T | null> {
    return await this.db.prepare(`SELECT * FROM ${this.table} WHERE id = ?`).bind(id).first<T>();
  }

  async create(data: Partial<T>): Promise<void> {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => "?").join(", ");
    const values = Object.values(data);
    await this.db.prepare(
      `INSERT INTO ${this.table} (${keys.join(", ")}) VALUES (${placeholders})`
    ).bind(...values).run();
  }

  async update(id: number, data: Partial<T>): Promise<void> {
    const sets = Object.keys(data).map(k => `${k} = ?`).join(", ");
    const values = [...Object.values(data), id];
    await this.db.prepare(
      `UPDATE ${this.table} SET ${sets} WHERE id = ?`
    ).bind(...values).run();
  }

  async delete(id: number): Promise<void> {
    await this.db.prepare(`DELETE FROM ${this.table} WHERE id = ?`).bind(id).run();
  }
}
