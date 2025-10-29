import { describe, expect, it } from "bun:test";
import { transaction } from "../src/transaction";

class MockStatement {
  protected params: unknown[] = [];

  constructor(protected db: MockDB, protected query: string) {}

  bind(...params: unknown[]): this {
    this.params = params;
    return this;
  }

  async run(): Promise<{ success: boolean }> {
    this.db.executed.push({ query: this.query, params: [...this.params] });
    return { success: true };
  }
}

class MockDB {
  executed: Array<{ query: string; params: unknown[] }> = [];

  prepare(query: string): MockStatement {
    return new MockStatement(this, query);
  }
}

describe("transaction", () => {
  it("commits when the callback succeeds", async () => {
    const db = new MockDB();

    const result = await transaction(db as unknown as D1Database, async tx => {
      await tx.prepare("INSERT INTO users (name) VALUES (?)").bind("alice").run();
      return "done";
    });

    expect(result).toBe("done");
    expect(db.executed).toEqual([
      { query: "BEGIN", params: [] },
      { query: "INSERT INTO users (name) VALUES (?)", params: ["alice"] },
      { query: "COMMIT", params: [] },
    ]);
  });

  it("rolls back when the callback throws", async () => {
    const db = new MockDB();

    await expect(
      transaction(db as unknown as D1Database, async tx => {
        await tx.prepare("UPDATE users SET name = ? WHERE id = ?").bind("bob", 1).run();
        throw new Error("boom");
      })
    ).rejects.toThrow("boom");

    expect(db.executed).toEqual([
      { query: "BEGIN", params: [] },
      { query: "UPDATE users SET name = ? WHERE id = ?", params: ["bob", 1] },
      { query: "ROLLBACK", params: [] },
    ]);
  });

  it("rolls back if the commit fails", async () => {
    class CommitFailingStatement extends MockStatement {
      async run(): Promise<{ success: boolean }> {
        if (this.query === "COMMIT") {
          throw new Error("commit failed");
        }
        return super.run();
      }
    }

    class CommitFailingDB extends MockDB {
      override prepare(query: string): MockStatement {
        if (query === "COMMIT") {
          return new CommitFailingStatement(this, query);
        }
        return super.prepare(query);
      }
    }

    const db = new CommitFailingDB();

    await expect(
      transaction(db as unknown as D1Database, async tx => {
        await tx.prepare("DELETE FROM users WHERE id = ?").bind(1).run();
      })
    ).rejects.toThrow("commit failed");

    expect(db.executed).toEqual([
      { query: "BEGIN", params: [] },
      { query: "DELETE FROM users WHERE id = ?", params: [1] },
      { query: "ROLLBACK", params: [] },
    ]);
  });
});
