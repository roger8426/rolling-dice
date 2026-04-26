---
name: security-conventions
description: 前端安全規範 — XSS 防護 (v-html sanitize)、敏感資料邊界 (token/PII/API key)、runtimeConfig public/private、認證授權以 server 為主、server route 輸入驗證。當處理輸入輸出/認證/外部資源時自動參考。
paths: app/**/*.vue,app/**/*.ts,app/server/**/*.ts,app/composables/**/*.ts,app/plugins/**/*.ts
---

# 安全性規範

當實作、審查或重構涉及資料輸入輸出、認證、設定或外部資源時，請遵守以下規則。

> ⚠️ 本專案第一版 MVP 使用 SPA 模式（`ssr: false`）。CSR 安全規則為當前優先適用標準；Server Route 相關規則為前瞻性保留。

## 核心原則

1. 預設不信任任何外部輸入，包含 API response、URL 參數、使用者輸入。
2. 安全問題通常無法事後補救，必須在設計與實作階段預防。
3. 遵循最小權限原則：程式碼只存取它實際需要的資源。
4. 敏感資訊不得出現在任何可被使用者或外部觀察到的位置。

## XSS 防護

1. **禁止**在未經嚴格 sanitize 的情況下使用 `v-html`。
2. 若確實需要渲染 HTML 內容（如 CMS rich text），必須先使用 sanitize 函式處理：
   - 僅允許白名單標籤與屬性
   - 移除所有 `<script>`、`on*` 事件屬性、`javascript:` 協議
3. 用戶生成內容（UGC）必須在 server 端完成 sanitize，不依賴 client 端處理。
4. 避免動態組合 HTML 字串後插入 DOM。
5. `innerText` / `textContent` 優先於 `innerHTML`，Vue 的 `{{ }}` 插值已自動 escape，應優先使用。

## 敏感資料處理

1. 以下資料**不得**出現在下列位置：

   | 敏感資料             | 禁止位置                                   |
   | -------------------- | ------------------------------------------ |
   | Auth token / session | `localStorage`（建議使用 HttpOnly cookie） |
   | 個人識別資訊（PII）  | URL query string、`console.log`、錯誤訊息  |
   | API keys / secret    | client-side bundle、`runtimeConfig.public` |
   | 密碼                 | client state、log、任何非加密傳輸          |

2. `runtimeConfig` 使用規範：
   - `runtimeConfig.public` — 僅放可公開的設定（如 GA ID、API base URL）
   - `runtimeConfig`（非 public）— 放 server-only secret，**絕對不能**在 client 存取
3. 不要在 Pinia store 或 Vue reactive state 中儲存 access token；應由 server-side cookie 管理。
4. `console.log` 中不得出現 token、使用者個資、完整的 API response（尤其在 production）。

## SPA / CSR 安全要點（當前適用）

1. SPA 所有 API 呼叫透過外部服務，auth token 以 Authorization header 傳遞。
2. Token 儲存方式需安全：HttpOnly cookie 優先；若無法使用，考慮 memory-only 方案，避免 `localStorage`。
3. 無 server route 代表所有敏感邏輯必須由後端 API 保障，client 不可信任自身的權限判斷。
4. CORS 設定由後端控制，前端應注意 API base URL 的安全管理（透過 `runtimeConfig.public`）。

## 認證與授權

1. Client 端的認證狀態僅用於 UI 呈現，不可作為安全邊界。
2. Nuxt middleware 的 auth 檢查屬於 UX 導向（快速導向），不能取代後端 API 的真正授權驗證。
3. 以下為未來啟用 SSR 後適用：
   - 認證狀態的最終驗證必須發生在 server 端。
   - 每個需要授權的 server route 都必須獨立驗證請求來源的身份，不依賴 client 傳入的 user ID。
4. 若使用 JWT，驗證邏輯必須在後端執行，不在 client 端 decode 後自行判斷權限。

## Server Route 安全（未來啟用 SSR 後適用）

1. 所有 server route 的輸入參數（body、query、params）都必須驗證，不信任 client 傳入的資料。
2. 建議使用 schema 驗證（如 `zod`）對 request body 進行型別與格式驗證：

   ```ts
   const body = await readValidatedBody(event, schema.parse)
   ```

3. 避免直接將 client 傳入的參數用於資料庫查詢或 shell 命令（SQL injection / command injection）。
4. 回傳資料應僅包含必要欄位，不要直接回傳完整的 DB row 或 raw model。
5. 對外部 API 呼叫時，API key 必須在 server 端附加，不可在 client 端傳遞 API key。

## 依賴安全

1. 引入新套件前，應確認：
   - 套件維護狀態（最後更新時間、issue 數量）
   - 已知 CVE 漏洞（可使用 `npm audit`）
   - 套件的實際下載來源是否可信
2. 不要從非官方 CDN 或未驗證來源動態載入第三方 script。
3. 若需引入第三方 script（如聊天工具、廣告），應評估是否需要 CSP 設定。

## 避免事項

1. 不要在 client-side 使用 `eval()`、`new Function()` 或 `setTimeout(string)`。
2. 不要把 server-only 邏輯或設定放到 `plugins/`、`composables/` 等前端可存取區域。
3. 不要讓 API 回傳比前端實際需要更多的資料（避免 over-fetching 暴露敏感欄位）。
4. 不要信任 `referer` 或 `origin` header 作為唯一的 CSRF 防護手段。
5. 不要在錯誤訊息中回傳 stack trace、資料庫結構或內部路徑資訊。
6. 不要讓開發用的 debug 資訊或 mock endpoint 部署到 production。

## 輸出要求

當審查或實作涉及安全敏感場景時，應優先確認：

1. `v-html` 使用是否有 sanitize 防護
2. 敏感資料是否存放在不安全位置
3. server route 是否有輸入驗證
4. `runtimeConfig` public / private 邊界是否正確
5. client 端是否無意間暴露了不應公開的資訊
