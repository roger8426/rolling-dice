---
applyTo: "**/*.vue,components/**/*.vue,pages/**/*.vue,layouts/**/*.vue"
---

# 可及性規範（Accessibility）

當實作、審查或重構 UI 元件與頁面時，請遵守以下可及性基本要求。

## 核心原則

1. 可及性是功能完整性的一部分，不是額外加分項目。
2. 以語意化 HTML 為基礎，ARIA 屬性作為補充，而非替代語意 HTML 的手段。
3. **規則：能用原生 HTML 元素表達的語意，不要用 `div` + ARIA 模擬。**
4. 所有互動元件必須支援鍵盤操作，不能只依賴滑鼠。

## 語意化 HTML

1. 互動元素使用對應的原生標籤：
   - 觸發動作 → `<button>`
   - 頁面導航 → `<a href="...">`
   - 資料輸入 → `<input>` / `<select>` / `<textarea>`
2. 不要用 `<div>` 或 `<span>` 模擬按鈕，除非有充分的 ARIA 補充：
   ```html
   <!-- 避免 -->
   <div @click="submit">送出</div>

   <!-- 正確 -->
   <button type="button" @click="submit">送出</button>
   ```
3. 頁面結構應使用語意區塊元素：`<header>`、`<main>`、`<nav>`、`<footer>`、`<section>`、`<article>`。
4. 標題層級（`<h1>` → `<h6>`）應反映頁面資訊架構，不要為了視覺樣式調整標題層級。

## 表單可及性

1. 每個 `<input>` 都必須有對應的 `<label>`，透過 `for` / `id` 或包裹方式關聯。
2. 錯誤訊息必須透過 `aria-describedby` 與對應 input 建立關聯：
   ```html
   <input id="email" aria-describedby="email-error" aria-invalid="true" />
   <p id="email-error" role="alert">請輸入有效的電子信箱</p>
   ```
3. 必填欄位應標示 `aria-required="true"` 或原生 `required` 屬性。
4. 提交中狀態應停用按鈕並提示狀態，避免使用者重複送出。

## 互動元件 ARIA

1. 自訂 dropdown / select：
   - 觸發元素加 `aria-haspopup="listbox"` 與 `aria-expanded`
   - 選項清單加 `role="listbox"`，選項加 `role="option"`
2. 自訂 modal / dialog：
   - 容器加 `role="dialog"` 與 `aria-modal="true"`
   - 必須有 `aria-labelledby` 指向對話框標題
   - 開啟時 focus 應移入 dialog，關閉時 focus 應回到觸發元素
3. Tab 元件：
   - tab 列表加 `role="tablist"`
   - 每個 tab 加 `role="tab"` 與 `aria-selected`
   - 內容區加 `role="tabpanel"` 與 `aria-labelledby`
4. 載入中狀態：
   - 使用 `aria-busy="true"` 或 `role="status"` 通知輔助技術
   - 動態更新的訊息區塊加 `aria-live="polite"`（一般通知）或 `aria-live="assertive"`（緊急通知）

## 鍵盤操作

1. 所有互動元件必須可透過 `Tab` 鍵聚焦，聚焦順序應符合視覺邏輯。
2. 按鈕與連結應支援 `Enter` 觸發；按鈕同時應支援 `Space`。
3. Modal 開啟時，focus 必須被鎖定在 modal 內（focus trap），避免使用者 Tab 到背景元素。
4. 自訂下拉選單應支援方向鍵（`↑` `↓`）導航、`Enter` 選擇、`Escape` 關閉。
5. 不要移除預設的 focus outline，若需要自訂樣式，必須確保視覺可辨識性不低於瀏覽器預設。

## 圖片與多媒體

1. 所有 `<img>` 必須具備 `alt` 屬性：
   - 有意義的圖片：描述圖片內容或功能
   - 裝飾性圖片：`alt=""`（空字串，讓輔助技術跳過）
2. `<NuxtImg>` 同樣需要 `alt` 屬性。
3. Icon-only 按鈕必須提供文字說明：
   ```html
   <button aria-label="關閉" @click="close">
     <IconX />
   </button>
   ```
4. 若有影片內容，應提供字幕或文字稿。

## 色彩與視覺

1. 文字與背景的色彩對比比例至少達到 **WCAG AA**：
   - 一般文字：對比比例 ≥ 4.5:1
   - 大文字（18px+ 或粗體 14px+）：對比比例 ≥ 3:1
2. 不要只用顏色傳遞狀態資訊（如錯誤只用紅色而無其他標示），應同時搭配圖示或文字。
3. 互動元件的 hover / focus 狀態必須有視覺回饋，不能只靠顏色變化。

## Vue / Nuxt 特定

1. 路由切換後應管理 focus，確保輔助技術使用者知道頁面已更新（可透過 `useRouter` hook 處理）。
2. `v-show` 隱藏的元素仍在 DOM 中可被 Tab 到，若需完整隱藏應使用 `v-if` 或搭配 `tabindex="-1"`。
3. 動態載入的內容（如無限捲動）應透過 `aria-live` 或 focus 管理通知輔助技術。
4. 若使用 Teleport 渲染 Modal，需確保 focus trap 依然正確運作。

## 避免事項

1. 不要使用 `<div>` 或 `<span>` 模擬可互動元件而不提供適當 ARIA。
2. 不要移除或覆蓋 focus outline 而不提供替代視覺指示。
3. 不要讓重要資訊只能透過滑鼠 hover 才能獲取。
4. 不要讓動態內容更新（toast、狀態變更）完全沉默，應通知輔助技術。
5. 不要為了視覺排版而破壞語意 HTML 結構（如用 `<h3>` 只因為字體大小合適）。
6. 不要忽略 `<img>` 的 `alt` 屬性，即使是裝飾性圖片也應設為 `alt=""`。

## 輸出要求

當實作或審查 UI 元件時，應確認：

1. 互動元素使用語意化 HTML 或有完整的 ARIA 補充
2. 所有 input 都有對應 label，錯誤訊息有 aria-describedby
3. 互動元件支援鍵盤操作
4. 圖片有適當的 alt 屬性
5. 動態內容更新有 aria-live 或 focus 管理
