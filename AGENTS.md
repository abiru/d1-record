# AGENTS.md

## 🎯 Purpose
This project embraces **AI-assisted open-source development**, led by Codex Agents.
Codex generates code, while human maintainers review and approve changes for safety and quality.
Together, we achieve a fast, no-code OSS development workflow.

---

## 👥 Roles

### 🤖 Codex Agent (AI)
- Works issue-by-issue, creating **branches under the `codex/` prefix** (e.g. `codex/add-pagination-support`).
- Submits implementation as a **Pull Request (PR)** referencing the corresponding GitHub issue.
- Must follow these conventions:
  - Written in **TypeScript (ESM syntax)**
  - Formatted with **ESLint** and **Prettier**
  - Includes **tests (Jest / Bun test)**
  - Updates `README.md` and `CHANGELOG.md` when needed
  - Uses **Conventional Commits** style messages
- PR descriptions must include:
  `Closes #<issue-number>` to link issues automatically.

### 👤 Human Maintainer
- Creates issues and defines clear acceptance criteria.
- Reviews Codex PRs and requests revisions if needed.
- Merges into `main` only after verifying:
  - Security & license compliance
  - CI (lint, type-check, test) all pass

### ⚙️ CI Agent (GitHub Actions)
- Runs automatically on every PR and push.
- Executes:
  - ESLint & Prettier checks
  - TypeScript compile (no emit)
  - Bun tests with coverage
- On main-branch merges, triggers release or version bump as configured.

---

## 🔁 Workflow
1. Human creates a GitHub Issue (e.g. “Add transaction helper”).
2. Codex opens a branch: `codex/add-transaction-helper`.
3. PR includes “Closes #<issue-number>” for auto-linking.
4. CI runs lint, type check, and tests.
5. Human reviews → approves → merges.
6. CI performs release or publish step if configured.

---

## 🧩 Commit Conventions (Conventional Commits)
feat: add pagination support
fix: correct D1 query binding
chore: update dependencies
test: add coverage for CRUD methods
docs: update README with examples

---

## ✅ Quality Rules
- Code format: `eslint`, `prettier`
- Type safety: `typescript --strict`
- Test framework: `bun test`
- Lint and test must pass (CI required for merge)

---

## 📚 Documentation
- Auto-generate API docs via `typedoc`
- Deploy docs to GitHub Pages from `/docs` branch

---

## 💬 Coding Philosophy
- Lightweight ORM built directly on Cloudflare D1
- Minimal dependencies (Node built-ins + Hono compatibility)
- Prioritize clarity and simplicity
