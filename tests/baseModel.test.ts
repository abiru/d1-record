import { describe, it, expect } from "bun:test";
import { BaseModel } from "../src/BaseModel";

type User = { id: number; age?: number; active?: number };

class MockStatement<T> {
  private params: any[] = [];

  constructor(private db: MockDB<T>, private query: string) {}

  bind(...params: any[]): this {
    this.params = params;
    this.db.lastQuery = this.query;
    this.db.lastParams = params;
    return this;
  }

  async all<R = T>(): Promise<{ results: R[] }> {
    this.db.lastQuery = this.query;
    this.db.lastParams = this.params;
    return { results: this.db.results as unknown as R[] };
  }

  async first<R = T>(): Promise<R | null> {
    this.db.lastQuery = this.query;
    this.db.lastParams = this.params;
    return this.db.firstResult as unknown as R | null;
  }

  async run<R = { success: boolean }>(): Promise<R> {
    this.db.lastQuery = this.query;
    this.db.lastParams = this.params;
    return { success: true } as R;
  }
}

class MockDB<T> {
  lastQuery: string | null = null;
  lastParams: any[] = [];
  results: T[];
  firstResult: T | null;

  constructor({ results = [], firstResult = null }: { results?: T[]; firstResult?: T | null } = {}) {
    this.results = results;
    this.firstResult = firstResult;
  }

  prepare(query: string): MockStatement<T> {
    this.lastQuery = query;
    this.lastParams = [];
    return new MockStatement<T>(this, query);
  }
}

class UserModel extends BaseModel<User> {}

describe("BaseModel", () => {
  it("should create instance", () => {
    const db = new MockDB<User>();
    const model = new UserModel("users", db as any);
    expect(model.table).toBe("users");
  });

  it("should accumulate where clauses and use them in first", async () => {
    const db = new MockDB<User>({ firstResult: { id: 1, age: 21, active: 1 } });
    const model = new UserModel("users", db as any);

    const user = await model.where("age > ?", 18).where("active = ?", 1).first();

    expect(user).toEqual({ id: 1, age: 21, active: 1 });
    expect(db.lastQuery).toBe("SELECT * FROM users WHERE age > ? AND active = ? LIMIT 1");
    expect(db.lastParams).toEqual([18, 1]);
  });

  it("should return null when first finds no record", async () => {
    const db = new MockDB<User>();
    const model = new UserModel("users", db as any);

    const result = await model.first();

    expect(result).toBeNull();
    expect(db.lastQuery).toBe("SELECT * FROM users LIMIT 1");
    expect(db.lastParams).toEqual([]);
  });

  it("should reset where clauses after executing queries", async () => {
    const db = new MockDB<User>({ firstResult: { id: 1, age: 25, active: 1 } });
    const model = new UserModel("users", db as any);

    await model.where("age > ?", 18).first();

    db.firstResult = { id: 2, age: 19, active: 0 };
    const nextUser = await model.first();

    expect(nextUser).toEqual({ id: 2, age: 19, active: 0 });
    expect(db.lastQuery).toBe("SELECT * FROM users LIMIT 1");
    expect(db.lastParams).toEqual([]);
  });

  it("should apply ordering, limit, and offset when querying all", async () => {
    const db = new MockDB<User>({ results: [] });
    const model = new UserModel("users", db as any);

    await model
      .where("active = ?", 1)
      .orderBy("id DESC")
      .limit(10)
      .offset(20)
      .all();

    expect(db.lastQuery).toBe(
      "SELECT * FROM users WHERE active = ? ORDER BY id DESC LIMIT 10 OFFSET 20"
    );
    expect(db.lastParams).toEqual([1]);
  });

  it("should reset ordering and pagination after executing a query", async () => {
    const db = new MockDB<User>({ results: [] });
    const model = new UserModel("users", db as any);

    await model.orderBy("age ASC").limit(5).offset(5).all();

    await model.all();

    expect(db.lastQuery).toBe("SELECT * FROM users");
    expect(db.lastParams).toEqual([]);
  });
});
