import { describe, it, expect } from "bun:test";
import { BaseModel } from "../src/BaseModel";

class MockDB {
  prepare(query: string) {
    return { all: async () => ({ results: [] }) };
  }
}

describe("BaseModel", () => {
  it("should create instance", () => {
    const db = new MockDB() as any;
    const model = new BaseModel("users", db);
    expect(model.table).toBe("users");
  });
});
