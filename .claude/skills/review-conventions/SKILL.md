---
name: review-conventions
description: Code review 完整檢查清單 — Vue/Nuxt/TypeScript/State/錯誤處理/安全/效能/可及性/測試 九大面向檢查項目，以及風險等級與最小修正優先的輸出格式。當使用者要求 review、審查或重構建議時自動參考。
paths: app/**
---

# Code Review 規範

當使用者要求 review、審查、重構建議時，請優先從以下角度檢查。

## Vue 檢查項目

1. template 是否過於複雜
2. props / emits 是否具語意
3. `computed` / `watch` 使用是否合理
4. component 是否責任過重
5. 是否存在可抽離但未抽離的重複邏輯

## Nuxt 檢查項目

1. SSR / CSR 邊界是否清楚
2. 是否可能產生 hydration mismatch
3. data fetching 方式是否合理
4. page / layout / middleware / plugin 責任是否混亂
5. 是否誤用 client-only API

## TypeScript 檢查項目

1. 是否濫用 `any`
2. optional / nullable 是否安全
3. DTO / UI model 是否混用
4. 是否存在不安全 assertion
5. 型別邊界是否模糊

## State 檢查項目

1. local state / composable / store 邊界是否合理
2. store 是否過度承擔責任
3. 是否把一次性狀態錯放進全域
4. state 更新流程是否清楚

## 錯誤處理檢查項目

1. 可能失敗的操作是否都有明確的 error state
2. loading / error / empty 三種情境是否都已處理，不存在空白畫面或靜默失敗
3. 錯誤訊息是否對使用者有意義，而非直接暴露技術細節
4. 錯誤通知（toast / alert）是否由統一入口管理，未散落各處
5. 表單錯誤是否有欄位層級的回饋

## 安全性檢查項目

1. 是否有未 sanitize 的 `v-html` 使用
2. 是否有敏感資料（token、PII）存放在不安全位置
3. server route 是否對輸入參數進行驗證
4. `runtimeConfig` public / private 邊界是否正確
5. 是否有 client-side 不應出現的敏感資訊

## 效能檢查項目

1. 是否有不必要的重渲染（template 直接呼叫 function 而非 computed）
2. 大型或非首屏元件是否使用 lazy loading
3. 大量清單渲染是否有正確 `:key`，資料量大時是否考慮虛擬捲動
4. 高頻事件 handler 是否有節流處理
5. 首屏資料是否在 server 端完成取得

## 可及性檢查項目

1. 互動元素是否使用語意化 HTML（`<button>`、`<a>`）而非 `<div>`
2. 所有 `<input>` 是否有對應 `<label>`
3. 自訂互動元件是否有完整 ARIA 屬性
4. 元件是否支援鍵盤操作
5. 圖片是否有 `alt` 屬性，icon-only 按鈕是否有 `aria-label`

## 測試覆蓋檢查項目

1. 新增的 composable 是否有對應的單元測試
2. 新增的 utils 是否有完整的純函式測試
3. store action 是否涵蓋錯誤分支的測試
4. 關鍵元件互動行為（props / emits）是否有 component 測試

## Review 輸出格式

當進行 review 時，輸出應優先包含：

1. 問題列表
2. 風險等級
3. 最小修正建議
4. 可選的進一步重構方向

## 原則

1. 優先指出高風險問題，而不是列出大量低價值瑣事。
2. 優先提供可落地的修正方向。
3. 若存在多種合理方案，需說明取捨。
4. 不要假裝只有一種正解。
