# 🌱 d1-record

> Lightweight ActiveRecord-style ORM for Cloudflare D1 — *TypeScript × Bun × Hono*

---

## 🧠 Overview

`d1-record` is an **ActiveRecord-inspired ORM** designed to make **Cloudflare D1** easy to use.
It brings the spirit of Ruby on Rails to TypeScript and Bun,
so you can work with data intuitively using a minimal setup.

---

## 🚀 Features

✅ **ActiveRecord-style API design**
Intuitive calls like `User.all()` and `User.find(id)`.

✅ **Cloudflare-native**
Plug directly into Workers, Hono, and D1.

✅ **Zero Dependency**
Runs on standard APIs only—no external dependencies.

✅ **TypeScript + Bun ready**
Type-safe and fast, minimizing differences between local development and Cloudflare production.

✅ **Consistent linting and formatting**
`ESLint` + `Prettier` keep every contributor and AI agent on the same style.

---

## 📦 Installation

### Bun (recommended)

```bash
bun add d1-record
```

### npm / pnpm

```bash
npm install d1-record
# or
pnpm add d1-record
```

---

## ⚙️ Usage

### 1️⃣ Define a model

```ts
import { BaseModel } from "d1-record";

export interface UserSchema {
  id?: number;
  name: string;
  email: string;
}

export class User extends BaseModel<UserSchema> {
  constructor(db: D1Database) {
    super("users", db);
  }
}
```

---

### 2️⃣ Perform CRUD operations

```ts
const user = new User(env.DB);

// Create (TypeScript infers fields like id automatically)
const created = await user.create({ name: "Abiru", email: "abiru@example.com" });
created.id; // => number

// Fetch all records
const all = await user.all();

// Conditional queries (supports method chaining)
const primary = await user.where("email = ?", "abiru@example.com").first();

// Sorting and pagination
const page = await user
  .where("active = ?", 1)
  .orderBy("active", "DESC")
  .orderBy("id")
  .limit(10)
  .offset(20)
  .all();

// orderBy() accepts separate column and direction arguments, and chaining enables multi-column sorting.

// Find by primary key
const one = await user.find(1);

// Update (only allows existing columns)
await user.update(1, { name: "Updated" });
// await user.update(1, { invalid: "nope" }); // ❌ TypeScript error

// Delete
await user.delete(1);
```

---

### 3️⃣ Group multiple operations in a transaction

```ts
import { transaction } from "d1-record";
import { User } from "./User";

await transaction(env.DB, async tx => {
  const users = new User(tx);
  const created = await users.create({ name: "Alice", email: "alice@example.com" });

  await users.update(created.id!, { name: "Alice (verified)" });
});
```

`transaction()` automatically handles `BEGIN`, `COMMIT`, and `ROLLBACK`, ensuring safe rollback when an exception occurs inside the callback.

---

### 4️⃣ Integration example with Hono

```ts
import { Hono } from "hono";
import { User } from "./User";

const app = new Hono<{ Bindings: { DB: D1Database } }>();

app.get("/users", async (c) => {
  const users = await new User(c.env.DB).all();
  return c.json(users);
});

export default app;
```

---

## 🧩 Design principles

* Always use D1 `prepare().bind()` to prevent SQL injection
* Focus on a **thin ActiveRecord-inspired layer** rather than a heavy ORM
* Prioritize readability and maintainability
* Rely on **ESLint + Prettier** for automatic formatting

  * Lint: `bun run lint`
  * Format: `bun run format`

---

## 🧪 Testing

Use Bun's built-in test runner.
Run fast tests with `MockDB` without connecting to an external database.

```bash
bun test
```

Sample test:

```ts
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
```

---

## 🧰 Development setup

### Install dependencies

```bash
bun install
```

### Lint & Format

```bash
bun run lint
bun run format
```

### Run tests

```bash
bun test
```

### Generate API docs (Typedoc)

```bash
bun run typedoc
```

---

## 🪜 Development workflow (overview)

1. Create an issue (use `.github/ISSUE_TEMPLATE/feature_codex.yml`)
2. Codex generates a PR from a `feature/issue-xxx` branch
3. CI (GitHub Actions) runs `bun test` and `lint`
4. A maintainer reviews and merges into `main`
5. Publish to npm automatically 🚀

---

## 🧱 Project structure

```
d1-record/
├── src/
│   ├── BaseModel.ts
│   ├── models/
│   │   └── User.ts
│   └── index.ts
├── tests/
│   └── baseModel.test.ts
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── release.yml
│   └── ISSUE_TEMPLATE/
│       └── feature_codex.yml
├── AGENTS.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
└── README.md
```

---

## 🧠 Tech stack

| Category | Technology                   |
| --------- | ---------------------------- |
| Language  | TypeScript (ESM)             |
| Runtime   | Bun                          |
| Database  | Cloudflare D1                |
| Framework | Hono                         |
| Test      | Bun Test                     |
| Lint      | ESLint                       |
| Format    | Prettier                     |
| Docs      | Typedoc                      |
| CI/CD     | GitHub Actions + npm Publish |

---

## 💬 Community & contributions

* Contributing guide → [CONTRIBUTING.md](CONTRIBUTING.md)
* Codex operations → [AGENTS.md](AGENTS.md)
* Questions & discussions → [Discussions](https://github.com/abiru/d1-record/discussions)

---

## 🧾 License

[MIT License](LICENSE)
