# Frontend Copilot Guidelines

本專案為 **Vue 3 + Nuxt 3 + TypeScript** 商用前端專案的 GitHub Copilot 規範集，  
用於約束 AI coding agent 的行為邊界、輸出品質與技術決策方向。

## 為何需要這份規範集

AI coding agent 缺乏預設的工程判斷力，容易：

- 在不需要時進行大範圍重構
- 忽略 SSR / CSR 執行環境差異
- 生成難以維護或缺乏型別安全的程式碼
- 省略錯誤處理、測試與可及性等非功能需求

本規範集提供明確的技術邊界與行為約束，確保 agent 輸出符合商業專案的可維護性標準。

---

## 檔案結構

```
.
├── AGENT.md                          # Agent 行為規範與協作模式
├── copilot-instructions.md           # 全域技術規範（最高優先）
├── instructions/                     # 情境規範（依檔案路徑自動套用）
│   ├── accessibility.instructions.md
│   ├── error-handling.instructions.md
│   ├── nuxt.instructions.md
│   ├── performance.instructions.md
│   ├── pinia.instructions.md
│   ├── review.instructions.md
│   ├── security.instructions.md
│   ├── structure.instructions.md
│   ├── tailwind.instructions.md
│   ├── testing.instructions.md
│   ├── typescript.instructions.md
│   └── vue.instructions.md
└── prompts/                          # 任務導向 Prompt 範本
    ├── accessibility-audit.prompt.md
    ├── bug-analysis.prompt.md
    ├── composable-refactor.prompt.md
    ├── error-handling.prompt.md
    ├── feature-planning.prompt.md
    ├── nuxt-review.prompt.md
    ├── performance-audit.prompt.md
    ├── pr-summary.prompt.md
    ├── store-design.prompt.md
    └── vue-component.prompt.md
```

---

## 規範優先順序

```
AGENT.md
  └── copilot-instructions.md          ← 全域，所有情境皆適用
        └── instructions/*.md          ← 依 applyTo 路徑條件套用
```

當規則發生衝突時，以上層規範為準。

---

## Instructions 說明

每個 instruction 檔案透過 frontmatter 的 `applyTo` 欄位，限制在特定檔案路徑下才生效。

| 檔案             | 套用範圍                                           | 說明                                     |
| ---------------- | -------------------------------------------------- | ---------------------------------------- |
| `structure`      | `**`                                               | Monorepo 架構、資料夾結構與分層原則      |
| `vue`            | `**/*.vue`                                         | Vue SFC 結構、reactivity、元件責任       |
| `nuxt`           | `pages/`, `layouts/`, `composables/`, `server/` 等 | SSR/CSR 邊界、data fetching、error.vue   |
| `typescript`     | `**/*.ts`, `**/*.vue`                              | 型別設計、安全性、命名慣例               |
| `pinia`          | `stores/**`, `**/*store*.ts`                       | Store 設計、storeToRefs、非同步 action   |
| `tailwind`       | `**/*.vue`, `**/*.tsx`                             | Class 排列、響應式、條件樣式、@apply     |
| `testing`        | `**/*.spec.ts`, `tests/**`                         | Vitest、@vue/test-utils、覆蓋率建議      |
| `performance`    | `**/*.vue`, `**/*.ts`, `nuxt.config.ts`            | 載入優化、Web Vitals、Bundle 管理        |
| `error-handling` | `**/*.vue`, `**/*.ts`, `server/**`                 | 三態處理、API 錯誤、表單錯誤、Toast 集中 |
| `security`       | `**/*.vue`, `**/*.ts`, `server/**`                 | XSS、敏感資料、server route 驗證         |
| `accessibility`  | `**/*.vue`, `components/**`, `pages/**`            | 語意 HTML、ARIA、鍵盤操作、WCAG AA       |
| `review`         | `**`                                               | Code review 完整檢查清單，涵蓋所有面向   |

---

## Prompts 說明

Prompts 為任務導向範本，在 VS Code Copilot Chat 中透過 `@workspace /prompt` 呼叫，或直接複製使用。

| 檔案                  | 用途                                      |
| --------------------- | ----------------------------------------- |
| `bug-analysis`        | 分析 Bug 根因，輸出最小修正方案與波及區域 |
| `feature-planning`    | 新功能規劃，先評估架構風險再給實作建議    |
| `vue-component`       | 實作或重構 Vue 3 component                |
| `composable-refactor` | 評估是否適合抽成 composable 並進行重構    |
| `nuxt-review`         | 從 Nuxt 3 最佳實務角度審查頁面            |
| `error-handling`      | 設計或審查錯誤處理流程                    |
| `performance-audit`   | 效能問題排查與優化建議                    |
| `store-design`        | 設計或審查 Pinia store                    |
| `accessibility-audit` | 審查 UI 元件可及性問題                    |
| `pr-summary`          | 整理 PR 說明文件                          |

---

## 核心約束

以下為 agent 在任何情況下的預設行為限制，僅可由使用者明確授權後解除：

- **不主動大範圍重構**：修改範圍以任務所需為限
- **不引入新套件**：除非明確被要求
- **不變更對外 API**：component props / emits / server route 結構
- **不跨模組修改不相關檔案**
- **不在資訊不足時擴張修改範圍**
