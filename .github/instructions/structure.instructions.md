---
applyTo: '**'
---

# 專案結構規範

## Monorepo 概覽

本專案為 pnpm monorepo，包含以下兩個主要區塊：

```txt
rolling-dice/
├─ app/                    # Nuxt 應用（主產品）
├─ packages/
│  └─ ui/                  # Vue 元件庫（獨立子專案）
├─ public/
├─ nuxt.config.ts
├─ package.json
├─ pnpm-workspace.yaml
└─ tsconfig.json
```

### `app/` — Nuxt 應用

- 本專案的主要產品程式碼。
- 所有 `.github/instructions/` 下的規範僅適用於此區塊。
- 使用 `@ui` alias 引用 `packages/ui` 的元件與樣式。

### `packages/ui/` — Vue 元件庫

- 獨立的 Vue 3 元件庫，不依賴 Nuxt 生態。
- 有各自的 build pipeline（Vite library mode）、測試策略（Storybook + Playwright）與 design token 系統。
- **不受** Nuxt、Pinia、server route 等 app 層規範約束。
- app 可消費 UI library 的元件與 CSS token，但不應修改 UI library 的內部實作。

### `@ui` Alias

```ts
// nuxt.config.ts
alias: { '@ui': './packages/ui' }
```

使用方式：

```ts
import { Button, Modal } from '@ui'
```

### 匯入規則

1. UI library 的所有匯入**僅可透過 barrel（`@ui`）**進行，禁止繞過 barrel import 任何內部路徑：

   ```ts
   // ✅ 正確
   import { Button, Modal } from '@ui'
   import type { ButtonProps, ModalProps } from '@ui'

   // ❌ 禁止 — 繞過 barrel
   import Button from '@ui/src/components/button/Button.vue'
   import { useFocusTrap } from '@ui/src/composables/useFocusTrap'
   ```

2. 若需要使用 UI library 尚未從 barrel 匯出的模組，應向元件庫提出匯出需求，不得自行繞路。
3. `app/components/` 與 `app/composables/` 內的模組由 Nuxt 自動匯入，**不需要** explicit import。
4. 禁止對 Nuxt 自動匯入範圍內的 app 模組寫多餘的 explicit import。

### 元件規格查找

1. 使用 `@ui` 元件前，應先查閱 `packages/ui/src/components/<name>/README.md` 取得 props、emits、slots 規格與使用範例。
2. 元件總覽可查閱 `packages/ui/README.md` 的元件目錄表。
3. 修改元件庫程式碼時，應遵循 `packages/ui/.github/` 下的獨立規範，不適用本專案的 instructions。

### 子專案獨立性原則

1. **禁止**從 Nuxt 專案（`app/`）修改 `packages/ui/` 的任何內容。
2. 若發現元件庫的 bug 或設計問題，應另外提出需求與問題描述，不得直接修改元件庫程式碼。
3. 若專案需求與 library 元件差異過大無法滿足，代表這是客製化需求，應在 `app/components/` 內自行設計元件，由 Nuxt 專案管理。
4. 兩個專案保持完全獨立，不得互相干擾。

---

## App 資料夾結構

以下為 `app/` 內偏好的資料夾結構。
當新增檔案、規劃模組、建議重構位置時，應優先參考此結構。

```txt
app/
├─ assets/
│  ├─ images/
│  ├─ icons/
│  └─ styles/
├─ components/
│  ├─ common/
│  ├─ layout/
│  └─ business/
├─ composables/
│  ├─ ui/
│  └─ domain/
├─ layouts/
├─ middleware/              # 未來啟用 SSR 或需要路由守衛時建立
├─ pages/
├─ plugins/                 # 未來需要全域 plugin 時建立
├─ server/                  # 未來啟用 SSR 後建立
│  ├─ api/
│  ├─ utils/
│  └─ services/
├─ stores/
├─ types/
│  ├─ api/
│  ├─ models/
│  ├─ components/
│  └─ stores/
├─ tests/
│  ├─ unit/
│  │  ├─ composables/
│  │  ├─ utils/
│  │  └─ stores/
│  ├─ component/
│  └─ e2e/
├─ utils/
└─ app.vue
```

## 結構說明

### `components/common`

- 放置高重用、低業務耦合的共用元件
- 例如按鈕、輸入框、卡片、標籤、對話框基礎元件

### `components/layout`

- 放置版面相關元件
- 例如 header、sidebar、footer、page container

### `components/business`

- 放置與業務流程或特定功能相關的元件
- 例如商品篩選面板、訂單列表區塊、會員資料區塊

### `composables/ui`

- 放置偏 UI 互動與展示層協調邏輯
- 例如 modal 控制、tab 切換、列表篩選 UI 狀態

### `composables/domain`

- 放置偏業務邏輯或資料流程協調的 composable
- 例如搜尋條件處理、分頁流程、表單提交流程

### `server/api`

- 放置 Nuxt server routes
- ⚠️ 目前為 SPA 模式，此目錄待未來啟用 SSR 後建立

### `server/utils`

- 放置 server-only 的純工具函式

### `server/services`

- 放置 server 端資料聚合、商業流程協調、外部服務串接

### `types/api`

- 放置 DTO、API response、request payload 型別

### `types/models`

- 放置 domain model、UI model、view model

### `types/components`

- 放置共用 component props、emits 或相關型別

### `types/stores`

- 放置 Pinia store 相關型別

### `utils`

- 放置與 Vue / Nuxt reactivity 無直接耦合的前端純函式工具

### `tests/unit`

- 放置 composables、utils、stores 的純邏輯單元測試
- 子目錄依來源模組對應：`composables/`、`utils/`、`stores/`

### `tests/component`

- 放置 Vue component 的互動行為與 props/emits 契約測試

### `tests/e2e`

- 放置 Nuxt 整合測試或端對端測試（若專案採用）

## 結構使用原則

1. 新檔案應優先放入最符合責任的既有目錄。
2. 若只是單次使用且尚未證明有重用需求，不要過早建立新分類。
3. 若新功能已明顯符合既有分層，應優先沿用此樹狀結構。
4. 若實際專案已有既有慣例，應以既有慣例優先，避免為了貼合理想結構而大規模搬移。
5. 若需偏離此結構，應說明原因與取捨，而不是任意新增層級。

## 目錄角色偏好

### `pages/`

1. 放置 Nuxt page。
2. page 應以頁面組裝與 orchestration 為主。
3. page 不應承擔過多底層資料轉換與複雜邏輯。
4. 若 page 過胖，應優先考慮抽出 component 或 composable。

### `components/`

1. 放置可重用或頁面組裝需要的 Vue component。
2. component 應以 UI 呈現與互動為主要責任。
3. 若元件只屬於單一頁面且無重用價值，可放在頁面鄰近結構，但若專案尚未採此策略，則維持集中管理。
4. 共用元件與業務元件應依專案規模考慮分層，例如：
   - `components/common`
   - `components/layout`
   - `components/business`

### `composables/`

1. 放置可重用邏輯與狀態協調邏輯。
2. composable 應保持單一責任。
3. composable 不應直接變成大型業務流程容器。
4. 若邏輯只屬於單頁且不具重用價值，應先評估是否真的需要抽到 composables。

### `stores/`

1. 放置 Pinia store。
2. 僅處理跨 component 或跨 page 共享狀態。
3. 不要把一次性 page UI state 放進 store。
4. store 應以 domain 為單位，不做全能雜物箱。

### `types/`

1. 共用 TypeScript 型別優先集中放置於 `types/`。
2. 型別可依用途分層，例如：
   - `types/api`
   - `types/models`
   - `types/components`
   - `types/stores`
3. 不要求完全對應資料夾巢狀，但應保持命名與責任清楚。
4. 若型別僅屬局部且不具共用性，可與模組同層，但共用型別應優先集中管理。

### `server/`

> ⚠️ 目前為 SPA 模式，此目錄待未來啟用 SSR 後建立。

1. 放置 Nuxt server routes、server utilities、server-only 邏輯。
2. 涉及 private runtime config、資料聚合、敏感資訊處理時，優先放在 server 層。
3. 不要把 server-only 邏輯放到前端可直接存取的區域。

### `utils/` 或 `helpers/`

1. 放置與 Vue/Nuxt 無直接耦合的純函式工具。
2. 若邏輯依賴 reactivity、lifecycle 或 route context，不應放入 utils。
3. 不要把業務流程假裝包成 utils。

### `tests/`

1. 單元測試（composables、utils、stores）集中放置於 `tests/unit/`，依來源模組對應子目錄。
2. Vue component 測試放置於 `tests/component/`。
3. Nuxt 整合測試或 E2E 測試放置於 `tests/e2e/`（若存在）。
4. 若專案已採用 co-located 慣例（測試檔與原始碼同層），應延續既有規則，不隨意改為集中放置。
5. 測試檔命名與原始碼對應，使用 `.spec.ts` 後綴（例如 `useCart.spec.ts`）。
6. 不要將 fixture、mock data、test helper 混放於 `tests/` 各層，應統一放在 `tests/fixtures/` 或 `tests/helpers/`。

## 型別結構偏好

1. 偏好將共用型別集中管理，而不是大量散落在 component 同層。
2. 若為 component 相關型別，可放在 `types/components`。
3. 若為 API response / DTO，應考慮放在 `types/api`。
4. 若為 domain model 或 UI model，應明確區分命名與責任。
5. 命名建議清楚區分：
   - `XxxDto`
   - `XxxResponse`
   - `XxxModel`
   - `XxxViewModel`

## 元件結構偏好

1. 共用程度高的元件應放在共用區。
2. 與 layout 相關的元件應集中在 layout 類別結構中。
3. 與特定業務流程高度耦合的元件，不應過早提升為全域共用元件。
4. 若同一組 UI 結構在多頁使用，才考慮抽成共用 component。

## composable 結構偏好

1. composable 命名一律以 `useXxx` 為前綴。
2. 若專案規模成長，可依責任再區分：
   - `composables/domain`
   - `composables/ui`
3. 不要讓 composable 同時承擔：
   - API fetching
   - router control
   - toast
   - 表單提交
   - UI 狀態編排
     除非這些責任在同一個可接受的邊界內。

## 新增檔案時的決策順序

當需要新增檔案時，應依下列順序判斷放置位置：

1. 先判斷這個檔案屬於 page、component、composable、store、type、server 還是 utils。
2. 再判斷它是共用還是局部。
3. 再判斷它是否應集中管理，或應貼近使用場景。
4. 若無明確重用需求，不要預設建立過深層結構。
5. 若新增檔案會破壞既有一致性，應優先延續既有結構。

## 結構調整原則

1. 不要為了理論上的整齊而大規模重構資料夾。
2. 若只是新增功能，優先沿用現有結構。
3. 若現有結構已明顯妨礙維護，再提出重構方案。
4. 涉及跨資料夾大量搬移時，應先給分步方案。

## 避免事項

1. 不要把所有東西都放進 `components/`。
2. 不要把型別隨意散落在各檔案角落。
3. 不要把局部一次性邏輯過早抽成全域共用模組。
4. 不要讓 `stores/` 變成所有狀態的收容所。
5. 不要讓 `utils/` 混入與 Vue/Nuxt 強耦合的邏輯。
6. 不要因為短期方便而破壞長期可維護性。
7. 不要在沒有明確需求時建立過深的資料夾巢狀。
8. 不要把測試檔散落在各模組角落而沒有統一策略，應在專案初期確認採用集中或 co-located 方式並保持一致。
9. 不要在 `tests/` 內混放生產程式碼、共用 mock 與測試邏輯，應明確分層。

## 輸出要求

當建議新檔案位置、模組拆分或資料夾調整時，應優先做到：

1. 明確指出推薦放置位置
2. 說明為何放在該目錄
3. 保持與既有結構一致
4. 避免無必要的結構膨脹
5. 若有替代方案，需說明取捨
