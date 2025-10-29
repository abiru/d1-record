export abstract class BaseModel<T> {
  private whereClauses: string[] = [];
  private whereParams: any[] = [];
  private orderClause?: string;
  private limitValue?: number;
  private offsetValue?: number;

  constructor(public table: string, public db: D1Database) {}

  where(condition: string, ...params: any[]): this {
    this.whereClauses.push(condition);
    this.whereParams.push(...params);
    return this;
  }

  orderBy(clause: string): this {
    this.orderClause = clause;
    return this;
  }

  limit(n: number): this {
    this.limitValue = n;
    return this;
  }

  offset(n: number): this {
    this.offsetValue = n;
    return this;
  }

  async first(): Promise<T | null> {
    const { query, params } = this.buildSelectQuery(1);
    const statement = this.db.prepare(query);
    const executor = params.length ? statement.bind(...params) : statement;
    const result = await executor.first<T>();
    this.resetQuery();
    return result ?? null;
  }

  private buildSelectQuery(limit?: number): { query: string; params: any[] } {
    let query = `SELECT * FROM ${this.table}`;

    if (this.whereClauses.length > 0) {
      query += ` WHERE ${this.whereClauses.join(" AND ")}`;
    }

    if (this.orderClause) {
      query += ` ORDER BY ${this.orderClause}`;
    }

    const finalLimit = typeof limit === "number" ? limit : this.limitValue;

    if (typeof finalLimit === "number") {
      query += ` LIMIT ${finalLimit}`;
    }

    const finalOffset = this.offsetValue;

    if (typeof finalLimit === "number" && typeof finalOffset === "number") {
      query += ` OFFSET ${finalOffset}`;
    }

    return { query, params: [...this.whereParams] };
  }

  private resetQuery(): void {
    this.whereClauses = [];
    this.whereParams = [];
    this.orderClause = undefined;
    this.limitValue = undefined;
    this.offsetValue = undefined;
  }

  async all(): Promise<T[]> {
    const { query, params } = this.buildSelectQuery();
    const statement = this.db.prepare(query);
    const executor = params.length ? statement.bind(...params) : statement;
    const { results } = await executor.all<T>();
    this.resetQuery();
    return results;
  }

  async find(id: number): Promise<T | null> {
    this.resetQuery();
    return await this.db.prepare(`SELECT * FROM ${this.table} WHERE id = ?`).bind(id).first<T>();
  }

  async create(data: Partial<T>): Promise<void> {
    this.resetQuery();
    const keys = Object.keys(data);
    const placeholders = keys.map(() => "?").join(", ");
    const values = Object.values(data);
    await this.db.prepare(
      `INSERT INTO ${this.table} (${keys.join(", ")}) VALUES (${placeholders})`
    ).bind(...values).run();
  }

  async update(id: number, data: Partial<T>): Promise<void> {
    this.resetQuery();
    const sets = Object.keys(data).map(k => `${k} = ?`).join(", ");
    const values = [...Object.values(data), id];
    await this.db.prepare(
      `UPDATE ${this.table} SET ${sets} WHERE id = ?`
    ).bind(...values).run();
  }

  async delete(id: number): Promise<void> {
    this.resetQuery();
    await this.db.prepare(`DELETE FROM ${this.table} WHERE id = ?`).bind(id).run();
  }
}
