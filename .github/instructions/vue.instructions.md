---
applyTo: '**/*.vue'
---

# Vue 元件規範

當處理 Vue 單檔元件時，請遵守以下規則。

## 結構規範

1. 預設使用 `<script setup lang="ts">`。
2. 保持 template 易讀，避免深層巢狀與過長 inline expression。
3. 複雜邏輯應移至具名 `computed`、helper function 或 composable。
4. `script setup` 內部建議排列順序：
   - imports
   - types
   - props / emits
   - refs / reactive state
   - computed
   - watchers
   - methods / handlers

## Props / Emits / Slots

1. props 命名需具語意，不可過度抽象。
2. emits 應優先表達業務意圖，而不是單純 DOM 動作。
3. slots 應保留清楚的責任邊界。
4. 不要為了可能的重用而設計過大 props API。

## Reactivity

1. 推導值優先使用 `computed`。
2. `watch` 只處理副作用，不作為主要資料推導工具。
3. 避免不必要的 deep watch。
4. 避免過度複雜的巢狀 reactive 結構。

## 元件責任

1. 展示型元件應盡量保持單純。
2. 容器型元件可以負責資料協調，但不要同時承擔過多職責。
3. 若 component 同時負責：
   - fetching
   - mapping
   - rendering
   - navigation
   - side effects

   應考慮拆分。

## v-model 自訂元件

1. 自訂 form 元件應透過 `defineModel()` 實作雙向綁定（Vue 3.4+），取代手動定義 `modelValue` prop 與 `update:modelValue` emit：
   ```ts
   const model = defineModel<string>()
   ```
2. 若需多個 v-model，使用具名 v-model：`defineModel('visible')`。
3. v-model 元件應與原生 input 行為保持一致語意（value 改變時才 emit，而非每次 render）。
4. 不要讓 v-model 元件同時承擔業務邏輯，應保持純 UI 職責。

## provide / inject

1. `provide / inject` 適用於跨多層元件傳遞資料的場景，避免 prop drilling。
2. 使用 Symbol 作為 injection key，並搭配型別定義，確保型別安全：
   ```ts
   const ThemeKey: InjectionKey<Ref<string>> = Symbol('theme')
   ```
3. 不要濫用 `provide / inject` 替代正常 props / emits 傳遞，適用場景是 layout 層提供給深層元件的設定（如 theme、locale、form context）。
4. 避免在 `inject` 端直接修改 provided 值，應由 provide 端提供修改方法。

## 可及性基本要求

1. 互動元素使用語意化 HTML，不以 `<div>` 模擬 `<button>`。
2. Icon-only 按鈕必須有 `aria-label`。
3. 自訂互動元件（modal、dropdown）需提供對應 ARIA 屬性與鍵盤支援。
4. 動態更新的通知區塊應加上 `aria-live`。
5. 詳細規範請參考 `accessibility.instructions.md`。

## 型別

1. props、emits、slots 型別需完整。
2. 避免 `any`。
3. 事件 payload 應具明確型別。

## 避免事項

1. 不要在 template 中寫過長條件運算。
2. 不要把 API response raw shape 直接當作 UI model 使用。
3. 不要為了理論重用而過早抽小元件。
4. 不要在元件中直接混用過多商業流程邏輯。
