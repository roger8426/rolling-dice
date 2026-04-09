---
applyTo: '**/*.ts,**/*.tsx,**/*.vue'
---

# TypeScript 規範

當處理 TypeScript 相關內容時，請遵守以下規則。

## 核心原則

1. 型別是設計邊界的一部分，不是事後補充。
2. 優先讓型別反映真實業務模型。
3. 不要用 `any` 逃避設計問題。
4. 不要用 assertion 假裝安全。

## 型別設計

1. 優先使用明確 interface / type。
2. DTO、response、domain model、UI model 在必要時應區分。
3. optional 與 nullable 必須明確處理。
4. 若資料可能不存在，請顯式反映在型別中。

## 安全性

1. 避免不安全的 `as unknown as ...`。
2. 保留 narrowing 流程。
3. 對外部資料來源應假設不可信。
4. 不要讓函式回傳型別過度寬鬆。

## Vue / Nuxt 相關

1. props 型別需準確。
2. emits payload 型別需準確。
3. composable 回傳值需有穩定結構。
4. API 資料應先經過型別約束或 mapping，再進入 UI。

## 命名建議

1. DTO 類型可使用 `XxxDto`。
2. API response 類型可使用 `XxxResponse`。
3. domain model 可使用 `Xxx`。
4. UI 專用 model 可使用 `XxxViewModel` 或專案既定命名。

## 避免事項

1. 不要大量使用 `Record<string, any>`。
2. 不要把所有欄位都做成 optional。
3. 不要直接把未驗證外部資料視為可信型別。
4. 不要因為求快而破壞型別可信度。
