---
applyTo: '**/*.vue,**/*.ts,pages/**/*.vue,composables/**/*.ts,server/**/*.ts'
---

# 錯誤處理規範

當實作、審查或重構涉及錯誤處理的場景時，請遵守以下規則。

> ⚠️ 本專案第一版 MVP 使用 SPA 模式（`ssr: false`）。CSR 錯誤處理規則為當前優先適用標準；Server Route 錯誤處理為前瞻性保留。

## 核心原則

1. 錯誤處理是功能的一部分，不是事後或例外的補充。
2. 每個可能失敗的操作都必須明確定義錯誤情境與對應行為。
3. 使用者應在任何錯誤情境下都能獲得清楚的回饋，而不是空白畫面或靜默失敗。
4. 錯誤呈現層（UI）與錯誤處理邏輯（業務）應明確分離。

## 全域錯誤頁面

1. 使用 `error.vue` 作為 Nuxt 全域錯誤頁面，覆蓋 4xx / 5xx 錯誤。
2. `error.vue` 應依 `statusCode` 提供差異化呈現：
   - `404`：頁面不存在，提供導回首頁的路徑
   - `403`：無存取權限，說明原因並提示正確操作
   - `500`：系統異常，避免暴露技術細節，提供聯絡或重試引導
3. 使用 `clearError` 讓使用者可從錯誤頁回復正常流程。
4. 不要在 `error.vue` 中暴露 stack trace、API 路徑或 server 錯誤詳情。

## API 錯誤處理

1. API 錯誤回應應統一處理，不要在每個 page 或 component 各自實作不同模式。
2. `useAsyncData` / `useFetch` 的 `error` ref 必須明確處理，不可靜默忽略：

   ```ts
   const { data, error, status } = await useAsyncData('key', fetcher)

   if (error.value) {
     // 明確處理，而非只是 console.log
   }
   ```

3. `$fetch` 呼叫應包在 try/catch 內，並對不同 error status 給出對應處理：
   - `400`：通常是客戶端輸入問題，應反映在 UI 表單上
   - `401`：需要登入，導向登入頁或觸發 refresh token 流程
   - `403`：無權限，顯示明確提示，不做靜默跳轉
   - `404`：資源不存在，提供合理的降級行為
   - `422`：驗證錯誤，解析 response body 後對應顯示欄位錯誤
   - `5xx`：系統問題，顯示通用錯誤提示，提供重試機制

4. 建議建立統一的 error mapper，將 API error response 轉換為 UI 可用的錯誤結構，而非在各處各自 parse。

## 錯誤通知（Toast / Alert）

1. 通知呈現邏輯應集中管理，不要在各 component 或 composable 各自直接呼叫 toast。
2. 建議透過專用 composable（如 `useNotification`）集中觸發通知，降低耦合。
3. 錯誤訊息必須對使用者有意義，不要直接顯示 HTTP status code 或技術錯誤訊息。
4. 短暫性錯誤（如網路超時）使用 toast；需要決策的錯誤（如確認覆寫）使用 dialog。
5. 成功、警告、錯誤訊息在視覺與語意上應有清楚的區分。

## 表單驗證錯誤

1. 表單驗證分為兩層，必須清楚分開：
   - **前端驗證**：即時反饋，阻止不必要的 API 呼叫
   - **後端驗證**：API 回傳的 `422` 或 `400` 錯誤，需對應回欄位層級
2. 後端欄位錯誤應對應至個別 input 欄位顯示，不要只顯示頁面頂部的通用錯誤。
3. 多欄位錯誤應同時顯示，不要只顯示第一個錯誤後等使用者再次送出。
4. 驗證通過後提交、提交中（loading）、提交失敗三個狀態需在 UI 上有明確差異。

## Composable 錯誤處理

1. composable 內的非同步操作需回傳 `error` 狀態，供呼叫端決定如何呈現。
2. composable 不應自行決定錯誤的呈現方式（不要在 composable 內直接呼叫 toast）。
3. 建議的回傳結構：

   ```ts
   return {
     data,
     error, // Ref<Error | null>
     status, // Ref<'idle' | 'pending' | 'success' | 'error'>
     execute,
   }
   ```

4. 若 composable 需要副作用（如 toast），應透過 callback 或 event 讓呼叫端控制。

## CSR 錯誤處理要點（當前適用）

1. SPA 所有錯誤處理發生在 client 端，網路錯誤是最常見的失敗情境。
2. 每個 API 呼叫都必須考慮網路中斷、timeout、非預期回應。
3. 頁面初始載入時的 API 失敗需有完整降級方案，不可出現空白頁面。
4. 可考慮全域的 Vue `errorHandler` 或 Nuxt `vue:error` hook 作為未捕獲錯誤的最後防線。

## Server Route 錯誤處理（未來啟用 SSR 後適用）

1. server route 應使用 `createError` 回傳具語意的 HTTP 錯誤：

   ```ts
   throw createError({ statusCode: 404, statusMessage: 'Resource not found' })
   ```

2. 不要讓 server route 靜默吞掉錯誤後回傳錯誤的資料結構。
3. server route 的錯誤訊息不應包含 stack trace 或 server 內部資訊。
4. 對外部 API 呼叫失敗應有明確的 fallback 或對應 error code 轉換。

## Loading / Error / Empty State

每個資料驅動的 UI 區塊必須處理三種狀態：

| 狀態        | 要求                                  |
| ----------- | ------------------------------------- |
| **Loading** | 骨架屏或 spinner，避免版面位移（CLS） |
| **Error**   | 清楚的錯誤提示，提供重試入口          |
| **Empty**   | 明確的空狀態說明，而非空白畫面        |

缺少任一狀態都視為不完整的實作。

## 避免事項

1. 不要靜默吞掉錯誤（空 catch block 或只 `console.error`）。
2. 不要把後端的技術錯誤訊息直接顯示給終端使用者。
3. 不要讓錯誤處理邏輯散落在 template、composable、store、page 各處而無統一模式。
4. 不要把 loading / error / data 三個狀態的判斷混在 template 中成為複雜條件樹。
5. 不要在發生錯誤時只讓頁面停在 loading 狀態而不回饋給使用者。
6. 不要讓 `error.vue` 暴露任何系統內部資訊。

## 輸出要求

當實作或審查錯誤處理時，應優先確認：

1. 所有可能失敗的操作都有明確的 error state
2. loading / error / empty 三狀態都已處理
3. 錯誤訊息對使用者有意義且不暴露系統細節
4. 錯誤呈現邏輯集中管理，不散落各處
5. server route 錯誤有統一的回傳結構
