# 🌱 d1-record

> Cloudflare D1 用の軽量 ActiveRecord風 ORM — *TypeScript × Bun × Hono*

---

## 🧠 概要

`d1-record` は、**Cloudflare D1** を手軽に扱うための **ActiveRecordライクなORM** です。
Ruby on Rails の思想を TypeScript と Bun 上で再現し、
最小限の構成で直感的にデータ操作を行えます。

---

## 🚀 特徴

✅ **ActiveRecord風のAPI設計**
`User.all()` や `User.find(id)` のように直感的。

✅ **Cloudflareネイティブ**
Workers / Hono / D1 に直接組み込める。

✅ **Zero Dependency**
標準APIのみで動作。外部依存なし。

✅ **TypeScript + Bun対応**
型安全で高速。ローカル開発とCloudflare本番環境の差を最小化。

✅ **Lint & Format統一**
`ESLint` + `Prettier` により、全開発者・AIが同一フォーマットでコーディング。

---

## 📦 インストール

### Bun（推奨）

```bash
bun add d1-record
```

### npm / pnpm

```bash
bun install d1-record
```

---

## ⚙️ 使い方

### 1️⃣ モデル定義

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

### 2️⃣ CRUD操作

```ts
const user = new User(env.DB);

// 作成
await user.create({ name: "Abiru", email: "abiru@example.com" });

// 一覧取得
const all = await user.all();

// 特定ID取得
const one = await user.find(1);

// 更新
await user.update(1, { name: "Updated" });

// 削除
await user.delete(1);
```

---

### 3️⃣ Honoとの統合例

```ts
import { Hono } from "hono";
import { User } from "./models/User";

const app = new Hono<{ Bindings: { DB: D1Database } }>();

app.get("/users", async (c) => {
  const users = await new User(c.env.DB).all();
  return c.json(users);
});

export default app;
```

---

## 🧩 設計ポリシー

* D1の `prepare().bind()` を常に使用し、SQLインジェクションを防止
* ORMというより「**ActiveRecord風の薄いレイヤー**」
* 可読性と保守性を最優先
* **ESLint + Prettier** により自動整形

  * Lint: `bun run lint`
  * Format: `bun run format`

---

## 🧪 テスト

Bun標準のテストランナーを使用。
外部DBを利用せず、`MockDB` を使った高速テストが可能です。

```bash
bun test
```

テストサンプル：

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

## 🧰 開発環境構築

### セットアップ

```bash
bun install
```

### Lint & Format

```bash
bun run lint
bun run format
```

### テスト

```bash
bun test
```

### APIドキュメント生成（Typedoc）

```bash
bun run typedoc
```

---

## 🪜 開発フロー（概要）

1. Issueを作成（`.github/ISSUE_TEMPLATE/feature_codex.yml`を使用）
2. Codexが `feature/issue-xxx` ブランチでPRを生成
3. CI（GitHub Actions）が `bun test` / `lint` を実行
4. Maintainerがレビューして `main` にマージ
5. 自動で npm に公開 🚀

---

## 🧱 フォルダ構成

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

## 🧠 技術スタック

| カテゴリ      | 技術                           |
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

## 💬 コミュニティ & コントリビューション

* 貢献方法 → [CONTRIBUTING.md](CONTRIBUTING.md)
* Codex運用 → [AGENTS.md](AGENTS.md)
* 質問・議論 → [Discussions](https://github.com/abiru/d1-record/discussions)

---

## 🧾 ライセンス

[MIT License](LICENSE)
