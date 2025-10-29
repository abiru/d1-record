type Simplify<T> = { [K in keyof T]: T[K] } & {};

type PrimaryKeyValue<T> = "id" extends keyof T ? NonNullable<T["id"]> : never;

type CreationAttributes<T> = Simplify<
  Omit<T, "id"> & ("id" extends keyof T ? Partial<Pick<T, "id">> : {})
>;

type UpdateAttributes<T> = Simplify<Partial<Omit<T, "id">>>;

type RowWithId<T> = "id" extends keyof T ? Simplify<Omit<T, "id"> & { id: NonNullable<T["id"]> }> : T;

export abstract class BaseModel<T extends object> {
  private whereClauses: string[] = [];
  private whereParams: unknown[] = [];
  private orderClause?: string;
  private limitValue?: number;
  private offsetValue?: number;

  constructor(public table: string, public db: D1Database) {}

  where(condition: string, ...params: unknown[]): this {
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

  async first(): Promise<RowWithId<T> | null> {
    const { query, params } = this.buildSelectQuery(1);
    const statement = this.db.prepare(query);
    const executor = params.length ? statement.bind(...params) : statement;
    const result = await executor.first<RowWithId<T>>();
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

  async all(): Promise<Array<RowWithId<T>>> {
    const { query, params } = this.buildSelectQuery();
    const statement = this.db.prepare(query);
    const executor = params.length ? statement.bind(...params) : statement;
    const { results } = await executor.all<RowWithId<T>>();
    this.resetQuery();
    return results;
  }

  async find(id: PrimaryKeyValue<T>): Promise<RowWithId<T> | null> {
    this.resetQuery();
    return await this.db
      .prepare(`SELECT * FROM ${this.table} WHERE id = ?`)
      .bind(id)
      .first<RowWithId<T>>();
  }

  async create(data: CreationAttributes<T>): Promise<RowWithId<T>> {
    this.resetQuery();
    const keys = Object.keys(data);
    const placeholders = keys.map(() => "?").join(", ");
    const values = Object.values(data);
    return await this.db
      .prepare(
      `INSERT INTO ${this.table} (${keys.join(", ")}) VALUES (${placeholders})`
      )
      .bind(...values)
      .run<RowWithId<T>>();
  }

  async update(id: PrimaryKeyValue<T>, data: UpdateAttributes<T>): Promise<void> {
    this.resetQuery();
    const sets = Object.keys(data).map(k => `${k} = ?`).join(", ");
    const values = [...Object.values(data), id];
    await this.db.prepare(
      `UPDATE ${this.table} SET ${sets} WHERE id = ?`
    ).bind(...values).run();
  }

  async delete(id: PrimaryKeyValue<T>): Promise<void> {
    this.resetQuery();
    await this.db.prepare(`DELETE FROM ${this.table} WHERE id = ?`).bind(id).run();
  }
}

export type BaseModelCreationAttributes<T extends object> = CreationAttributes<T>;
export type BaseModelUpdateAttributes<T extends object> = UpdateAttributes<T>;
export type BaseModelRow<T extends object> = RowWithId<T>;
export type BaseModelPrimaryKey<T extends object> = PrimaryKeyValue<T>;
