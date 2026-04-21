# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Rolling Dice 專案全域指示

本專案使用 Vue 3 + Nuxt 3 + TypeScript 作為核心技術棧。本檔為 Claude Code 在本專案內的最高原則，優先於任何子 skill 規範。

## 常用指令

```sh
pnpm dev               # 開發伺服器 (http://localhost:3000)
pnpm type-check        # nuxi typecheck
pnpm lint              # oxlint + eslint（含 --fix）
pnpm lint:check        # 僅檢查，不修改
pnpm format            # prettier --write
pnpm test:unit         # vitest（watch 模式）
pnpm test:unit:ci      # vitest --run（CI / 單次）
pnpm test:coverage     # 覆蓋率報告（門檻 80%）
pnpm generate          # 產出靜態站（部署至 GitHub Pages）
pnpm preview           # 預覽靜態產出
pnpm update:ui         # 更新 packages/ui submodule 並重新 build
```

執行單一測試檔：`pnpm test:unit app/tests/unit/stores/character.spec.ts`
單一測試名稱：`pnpm test:unit -t "部分名稱"`

Git hooks 走 `.githooks/`（由 `prepare` script 設定 `core.hooksPath`）。
`lint-staged` 會在 commit 前跑 oxlint → eslint → prettier，請勿用 `--no-verify` 繞過。

## 架構總覽

### Monorepo 結構

- pnpm workspace（`pnpm-workspace.yaml`），兩個子專案：
  - `app/` — Nuxt 應用（主產品），本 CLAUDE.md 與 `.claude/skills/` 的規範**只**適用於此。
  - `packages/ui/` — Vue 元件庫，**git submodule**，獨立開發與 build pipeline。app 端**只消費、不修改**其原始碼；customize 請在 `app/components/` 自己重寫。
- `@ui` alias 在 `nuxt.config.ts` 與 `vitest.config.ts` 皆有定義：Nuxt 端指向 `packages/ui/dist/index.js`（build 產物），測試端指向 `packages/ui`。**submodule 未 init 或未 build 時 app 會跑不起來**——首次 clone 需 `pnpm init:ui`。

### 執行環境

- **SPA 模式**（`ssr: false`）。所有 `.claude/skills/` 中關於 SSR / server route 的規則為前瞻性保留，當前不強制；CSR 規則為現行標準。
- 靜態部署（GitHub Pages），base URL 由 `NUXT_APP_BASE_URL` env 控制，見 `nuxt.config.ts`。

### Auto-import 設定

`nuxt.config.ts` 擴充了 `imports.dirs`：

- `helpers/` — 業務邏輯純函式（規則計算、分級判斷）
- `composables/domain/` — 領域邏輯 composable
- `composables/ui/` — UI 層 composable

這三個目錄**不需 import 也能使用**。`utils/` 則走 Nuxt 預設 auto-import。

### `app/` 分層

- `components/{common,layout,business}/` — UI 層，business 為特定領域元件
- `composables/{domain,ui}/` — 可重用邏輯，`domain` 為業務、`ui` 為 UI 行為
- `helpers/` vs `utils/` — helpers 含業務語意（D&D 規則等），utils 為泛用工具
- `stores/` — Pinia，僅跨元件 / 跨頁面共享才放這裡；一次性 page state 用 local state
- `types/{business,common,layout}/` — domain type 分層放置
- `pages/` — Nuxt file-based routing，page 僅組裝與 orchestration

### 測試

- Vitest + `@vue/test-utils` + `happy-dom`/`jsdom` 雙環境（config 使用 jsdom）
- setup 檔：`app/tests/setup.ts`
- 測試檔位置：`app/tests/**/*.spec.ts`（**不是** colocated）
- coverage 門檻 80%（lines / functions / branches / statements），排除 `types/`、`tests/`、`assets/`
- `@vue/devtools-api` 有 mock（見 `vitest.config.ts`），pinia 被 inline 處理

### Lint 雙層

`lint` 依序執行 `oxlint --fix` 再 `eslint --fix`。oxlint 為快速第一關，eslint（含 `@nuxt/eslint`）為完整規則。兩者皆通過才算合格。

## 專案範圍

1. 本專案為 pnpm monorepo，包含 `app/`（Nuxt 應用）與 `packages/ui/`（Vue 元件庫）。
2. 所有 `.claude/skills/` 下的規範**僅適用於 `app/` 內的程式碼**。
3. `packages/ui/` 為獨立子專案，有各自的開發慣例與 build pipeline，不受 Nuxt 生態規範約束。
4. app 可消費 UI library 的元件與 CSS `token（透過 `@ui` alias），但不應修改 UI library 的內部實作。
5. **禁止**從 app 修改 `packages/ui/` 的程式碼。元件問題應另提需求描述；客製化需求應在 `app/components/` 自行實作。

## 執行環境

1. 第一版 MVP 使用 SPA 模式（`ssr: false`）。
2. **CSR 規則為當前優先適用標準**。
3. 各 skill 中關於 SSR、server route 的規則為前瞻性保留，SPA 模式下不強制適用。
4. 當未來切換至 SSR 模式時，相關規則自動生效。

## 核心原則

1. 優先最小必要改動，不做無授權的大範圍重寫。
2. 優先可讀性、可維護性、可審查性，不追求炫技式抽象。
3. 優先符合 Vue / Nuxt 慣例，而不是套用通用但不貼合框架的模式。
4. 清楚區分 UI、狀態、資料取得、資料轉換與副作用。
5. 型別安全是基本要求，除非明確允許，否則不要使用 `any`。
6. 注意執行環境差異：SPA 模式下以 CSR 為準，未來啟用 SSR 後需遵守 SSR / CSR 邊界約束。
7. 除非明確要求，不要新增第三方套件。
8. 產出的程式碼必須讓人類工程師容易理解、容易 review、容易接手。
9. 偏實務導向，偏符合 Vue / Nuxt idiomatic 寫法。
10. 偏清楚責任分離，但不過度抽象。

## Vue 規則（摘要）

1. Vue SFC 預設使用 `<script setup lang="ts">`。
2. 可推導資料優先使用 `computed`。
3. `watch` 只用於副作用、同步行為或監聽外部變化，不作為預設資料推導工具。
4. 避免把複雜邏輯直接寫在 template。
5. props、emits、slots 必須具備清楚語意。
6. 不要為了理論上的重用而過度抽象元件。
7. 不要在單一 component 中混合 rendering、fetching、navigation、資料轉換與流程控制。

詳細規範請參考 `.claude/skills/vue-conventions/`。

## Nuxt 規則（摘要）

1. 必須明確區分 server 與 client 執行環境。
2. 首屏 SSR 關鍵資料優先考慮 `useAsyncData`。
3. `useFetch` 只在符合其資源型取得語意時使用。
4. 事件驅動或非初始載入請求，可考慮使用 `$fetch`。
5. 未加 client guard 時，不可直接使用 `window`、`document`、`localStorage`。
6. page 應以頁面組裝與 orchestration 為主，不承擔過多底層 transport 細節。
7. 涉及私密資訊、聚合邏輯或安全邊界時，優先考慮 server routes。

詳細規範請參考 `.claude/skills/nuxt-conventions/`。

## TypeScript 規則（摘要）

1. 避免 `any`。
2. 優先使用明確的 domain type，而不是寬鬆物件結構。
3. DTO、API response、UI model 在需要時應分層。
4. 不要用不安全 assertion 掩蓋型別設計問題。
5. 保留 narrowing、nullable safety 與 optional 欄位處理。

詳細規範請參考 `.claude/skills/typescript-conventions/`。

## 狀態管理規則（摘要）

1. 預設先使用 local state。
2. 只有在真正跨 component 或跨 page 共享時，才考慮 Pinia。
3. 不要把一次性 page UI state 隨意提升到全域 store。
4. store action 應保持聚焦，不要讓 store 變成雜湊 service 容器。

詳細規範請參考 `.claude/skills/pinia-conventions/`。

## 補充規範索引

各主題詳細規範存放於 `.claude/skills/`，Claude 會依編輯的檔案路徑自動載入相應 skill：

| Skill                        | 主題                                   | 觸發範圍                                                                     |
| ---------------------------- | -------------------------------------- | ---------------------------------------------------------------------------- |
| `vue-conventions`            | Vue SFC 結構、reactivity、元件責任     | `app/**/*.vue`                                                               |
| `nuxt-conventions`           | SSR/CSR 邊界、data fetching、error.vue | `app/{pages,layouts,middleware,plugins,composables,server}/**`               |
| `pinia-conventions`          | Store 設計、storeToRefs、非同步 action | `app/stores/**`、`app/**/*store*.ts`                                         |
| `typescript-conventions`     | 型別設計、安全性、命名慣例             | `app/**/*.{ts,tsx,vue}`                                                      |
| `tailwind-conventions`       | Class 排列、響應式、token、@apply      | `app/**/*.{vue,tsx,jsx}`、`app/components/**`                                |
| `testing-conventions`        | Vitest、@vue/test-utils、覆蓋率        | `app/**/*.spec.ts`、`app/tests/**`、`vitest.config.*`                        |
| `accessibility-conventions`  | 語意 HTML、ARIA、鍵盤、WCAG AA         | `app/**/*.vue`、`app/components/**`、`app/pages/**`                          |
| `security-conventions`       | XSS、敏感資料、server route 驗證       | `app/**/*.{vue,ts}`、`app/server/**`、`app/composables/**`、`app/plugins/**` |
| `error-handling-conventions` | 三態處理、API 錯誤、表單錯誤           | `app/**/*.{vue,ts}`、`app/pages/**`、`app/composables/**`、`app/server/**`   |
| `performance-conventions`    | 載入優化、Web Vitals、Bundle 管理      | `app/**/*.{vue,ts}`、`app/pages/**`、`app/composables/**`、`nuxt.config.ts`  |
| `structure-conventions`      | Monorepo 架構、資料夾結構、分層原則    | `app/**`                                                                     |
| `review-conventions`         | Code review 完整檢查清單               | `app/**`                                                                     |

## 預設輸出期待

當使用者要求實作時，通常應輸出：

1. 任務理解或問題分析
2. 建議方案
3. 程式碼或 diff
4. 風險與驗證建議

當使用者要求 review 時，通常應輸出：

1. 問題列表
2. 風險等級
3. 最小修正方案
4. 可選的深入重構方向

當使用者要求 debug 時，通常應輸出：

1. 最可能根因
2. 驗證方式
3. 最小修正方案
4. 次要可能性

## 應避免的反模式

1. 可用 `computed` 解決的問題卻使用 `watch`
2. 單一 composable 同時承擔 fetching、routing、toast、submit、UI orchestration
3. 把一次性 local UI state 放進 Pinia
4. page 直接依賴不穩定的 raw API response shape
5. 在 SSR 環境直接使用瀏覽器 API
6. 未經授權的大範圍重構
7. 沒有證明需求前就新增抽象層

## 範圍控制

除非使用者明確要求，否則不要：

- 大範圍重新命名檔案
- 新增新套件
- 重設資料夾結構
- 變更既有對外 component API
- 修改不相關模組
