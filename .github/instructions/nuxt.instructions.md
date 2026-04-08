---
applyTo: 'pages/**/*.vue,layouts/**/*.vue,middleware/**/*.ts,plugins/**/*.ts,composables/**/*.ts,server/**/*.ts'
---

# Nuxt 規範

當處理 Nuxt 相關檔案時，請遵守以下規則。

> ⚠️ 本專案第一版 MVP 使用 SPA 模式（`ssr: false`）。CSR 規則為當前優先適用標準；SSR / server route 規則為前瞻性保留，SPA 模式下不強制適用。

## CSR 執行環境（當前適用）

1. SPA 模式下不存在 hydration mismatch 問題。
2. 瀏覽器 API（`window`、`document`、`localStorage`）可直接使用，不需 client guard。
3. `onMounted` 是最早可存取 DOM 的生命週期。
4. 所有資料取得皆發生在 client 端，應注意初始 loading state 的使用者體驗。

## SSR / CSR 邊界（未來啟用 SSR 後適用）

1. 所有實作都必須先確認執行環境。
2. 不可在 server context 直接使用 `window`、`document`、`localStorage`。
3. 若需使用瀏覽器 API，必須加上 client guard 或改為 client-only 流程。
4. 需避免 hydration mismatch。

## Page 職責

1. page 主要負責頁面組裝、資料協調與 SEO/meta 設定。
2. page 不應承擔過多底層 transport、mapping、複雜狀態細節。
3. 若 page 過胖，優先考慮抽出 composable 或 data layer。

## Data Fetching

1. `useAsyncData` 可用於自動快取與 key 管理，SPA 下行為等同 client-side fetch。
2. `useFetch` 僅在符合其使用語意時使用。
3. 互動後才觸發的請求，可考慮 `$fetch`。
4. 避免序列 waterfall，多個獨立請求應並行處理。
5. 不要讓 page 同時管理太多分散的 fetch lifecycle。
6. 必須考慮 loading、error、empty state。
7. 頁面切換時的 loading 體驗需明確處理（skeleton / spinner）。

## Server Routes（未來啟用 SSR 後適用）

1. 涉及私密邏輯、server-only config、資料聚合時，優先 server routes。
2. 不要把不安全的後端資訊直接暴露在前端。
3. server route 回傳資料時，應盡量提供穩定結構。

## Middleware / Plugins

1. middleware 主要處理路由守衛、權限檢查、導向，不承擔完整業務流程。
2. plugin 不應成為大型雜物箱。
3. runtimeConfig 必須明確區分 public / private。

## SEO / Meta

1. page 層應集中管理 SEO 與 meta。
2. 需要時補上 title、description、canonical、open graph。
3. 不要將 SEO 邏輯分散在多處。

## 錯誤頁面

1. 必須提供 `error.vue` 作為全域錯誤頁面，覆蓋 4xx / 5xx 錯誤情境。
2. 依 `error.statusCode` 提供差異化呈現：`404` 導引使用者、`403` 說明權限、`500` 顯示通用提示。
3. `error.vue` 絕對不可暴露 stack trace、API 路徑或 server 內部資訊。
4. 使用 `clearError({ redirect: '/' })` 讓使用者可從錯誤頁回復正常流程。

## 資料生命週期管理

1. 當需要強制重新取得已快取資料時，使用 `refreshNuxtData(key)` 觸發。
2. 離開頁面或特定行為後需清除快取資料，使用 `clearNuxtData(key)`。
3. 避免在不必要的情況下呼叫 `refreshNuxtData`，應优先依賴 Nuxt 的自動快取機制。
4. 若頁面相同 key 的資料在不同路由間共用，需明確管理其生命週期，避免顯示過期資料。

## 避免事項

1. 不要在 page 直接耦合多個 raw API response。
2. 不要讓 middleware 或 plugin 承擔過多不相干責任。
3. 以下為未來啟用 SSR 後適用：
   - 不要忽略 server/client 執行差異。
   - 不要使用 client-only 資料破壞首屏一致性。
