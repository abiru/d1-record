# AGENTS.md

## 🎯 目的
このプロジェクトは、AIエージェント（Codex）を中心とした「ノーコードOSS開発」を目指します。

Codexがコードを生成し、人間（メンテナ）がレビュー・承認することで、安全かつ迅速な開発サイクルを実現します。

---

## 👥 役割定義

### 🧠 Codex Agent（AI）
- GitHubのIssue単位でコードを提案・実装する。
- 実装はPull Request（PR）として提出。
- 原則として以下を守る：
  - TypeScript（ESM構文）
  - ESLintとPrettierでフォーマット準拠
  - テストを含む（**Bun標準の`bun test`** を使用）
  - `README.md`・`CHANGELOG.md`更新を含める
- コミットメッセージは Conventional Commits に準拠する。
- すべてのPRには：
  - 実装コード
  - テスト
  - ドキュメント更新
  が含まれていること。

### 👤 Human Maintainer（人間）
- PRをレビューし、必要に応じてリクエスト修正。
- mainブランチへのマージは手動で行う。
- セキュリティリスク、OSSライセンス遵守を確認。

### 🤖 CI Agent（GitHub Actions）
- 自動でLint・Testを実行。
- mainへのマージ時にnpm publishを行う。
- Lint / Test に失敗したPRは自動的にRejectされる。

---

## 🔁 開発フロー
1. HumanがGitHub Issueを作成（例：「BaseModelにupdateメソッドを追加」）。
2. CodexがそのIssueを取得し、`feature/issue-xx`ブランチでPRを作成。
3. CIが自動でLint & Testを実行。
4. Humanがレビューし、Approve後にmainへマージ。
5. mainへのマージをトリガーに自動npmリリース。

---

## 🧩 コミット規約（Conventional Commits）
feat: add BaseModel CRUD methods
fix: correct insert syntax for D1
chore: update dependencies
test: add coverage for create and find
docs: update README for installation

---

## ✅ 品質ルール
- コード整形: `eslint`, `prettier`
- 型安全: `typescript --strict`
- テスト: `bun test`
- 外部接続を行わないMockDBを使用（D1接続は不要）
- Lintパス必須（CI通過しないとマージ不可）

---

## 📚 ドキュメント生成
- `typedoc`でAPIドキュメントを自動生成
- GitHub Pagesで公開（`/docs`ブランチ）

---

## 💬 コーディング方針
- D1のAPIを直接使う軽量ORM
- 外部依存は最小限（Node標準 + Hono互換）
- Readabilityとシンプルさを優先

---

## ✅ 品質ルール
- コード整形: `eslint`, `prettier`
- 型安全: `typescript --strict`
- テスト: `bun test`
- 外部接続を行わないMockDBを使用（D1接続は不要）
- Lintパス必須（CI通過しないとマージ不可）

---

## 📚 ドキュメント生成
- `typedoc`でAPIドキュメントを自動生成
- GitHub Pagesで公開（`/docs`ブランチ）

---

## 💬 コーディング方針
- D1のAPIを直接使う軽量ORM
- 外部依存は最小限（Node標準 + Hono互換）
- Readabilityとシンプルさを優先
