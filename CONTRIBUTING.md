
# 🤝 CONTRIBUTING.md — d1-record Contribution Guide

## 🎯 目的

`d1-record` は、**Cloudflare D1 用の軽量 ActiveRecord風 ORM（TypeScript / Bun）** を目指すOSSです。
このプロジェクトは、**AIエージェント（Codex）と人間の共同開発**によって進化します。
ここでは、貢献（Contribution）に関するルール・フロー・ベストプラクティスをまとめています。

---

## 🧠 開発スタイル

このプロジェクトは以下の3者で運営されています：

| 役割                      | 担当内容                                  |
| ----------------------- | ------------------------------------- |
| 🧠 **Codex Agent**      | Issueを読み取り、コード・テスト・ドキュメントを自動生成してPRを提出 |
| 👤 **Human Maintainer** | PRレビュー、設計判断、npmリリース管理                 |
| 🤖 **CI Agent**         | Lint・Test・Releaseを自動実行                |

AIと人間が補完し合うことで、安全かつ迅速な開発サイクルを実現します。

---

## 🪜 開発フロー

### 1️⃣ Issue作成

* すべての開発タスクは **GitHub Issue** から始まります。
* Codexに依頼する場合は `.github/ISSUE_TEMPLATE/feature_codex.yml` を使用してください。
* 1つのIssueは1つの明確な目的に絞ります（例：「BaseModelにwhere()を追加」）。

### 2️⃣ CodexがPRを生成

* CodexはIssueの内容を解析し、`feature/issue-xxx` ブランチでPRを自動生成します。
* PRには必ず以下を含めます：

  * コード実装
  * テストコード（`bun test`で通過可能）
  * ドキュメント更新（`README.md`, `CHANGELOG.md`）

### 3️⃣ CIチェック

* GitHub Actionsが自動的に以下を実行します：

  * `bun lint`
  * `bun test`
* CIを通過しないPRは自動Rejectされます。

### 4️⃣ レビューとマージ

* Human Maintainerが内容をレビュー。
* 問題なければ `main` ブランチに手動マージ。
* マージをトリガーに自動で npm 公開（`release.yml`）。

---

## 📜 コーディング規約

### ✅ 言語と構文

* TypeScript + ESM構文
* Bun環境に準拠（Node特有のAPIは使用しない）
* `strict: true` モードで型安全を維持

### ✅ コード整形

* Linter: ESLint
* Formatter: Prettier
* Lintエラーは必ず修正してからPR提出

### ✅ テスト

* テストランナー：Bun標準（`bun test`）
* 外部DB接続は禁止、MockDBを使用
* `describe()` / `it()` 構文で明確な意図を記述

### ✅ コミット規約

すべてのコミットメッセージは [Conventional Commits](https://www.conventionalcommits.org/) に従います：

例:

* feat: add where() query helper
* fix: correct update() SQL bind order
* chore: update dependencies
* test: add coverage for delete()
* docs: improve README examples

---

## 🧩 ドキュメント

* APIドキュメントは `typedoc` により自動生成されます。
* コード変更時は `README.md` と `CHANGELOG.md` を更新してください。
* 新しい公開APIを追加した場合は、使用例を追記すること。

---

## 🧱 ブランチ運用ルール

| ブランチ名               | 用途                 |
| ------------------- | ------------------ |
| `main`              | 安定版（CI通過後、npm自動公開） |
| `feature/issue-xxx` | Codexが生成する作業ブランチ   |
| `docs/*`            | ドキュメント関連           |
| `test/*`            | テスト関連改善            |

---

## 🧰 開発環境セットアップ

インストール:

```
bun install
```

テスト:

```
bun test
```

Lint:

```
bun lint
```

ドキュメント生成（オプション）:

```
bun run typedoc
```

---

## 🧑‍💻 人間コントリビューター向け

人間が直接コードを修正・追加する場合：

* Codexと同じルールを遵守（型安全・Lint・テスト必須）
* PRには説明・背景・動作確認方法を明記
* 小さな修正であってもテストを含めること

---

## 🤖 Codex Agent向け補足

Codexは以下を遵守してください：

* `bun test` に通るコードのみPRすること
* `README.md`・`CHANGELOG.md`を更新すること
* SQLは常に `prepare().bind()` を使用
* 外部依存は追加しないこと（標準APIで完結）
* 可読性とメンテナンス性を最優先とすること

---

## 💬 コミュニケーション

* 仕様相談や改善提案は [Discussions](https://github.com/ledkikaku/d1-record/discussions) で歓迎。
* バグ報告は Issue タブから行ってください。
* PRに対するレビューはオープンな形で行われます。

---

## ❤️ 感謝

このプロジェクトは「**Herokuの美学 × Cloudflareの軽量性**」を再構築する試みです。
あなたの貢献が、Web開発をよりシンプルで美しいものにします。

**Thank you for helping build `d1-record`!**
