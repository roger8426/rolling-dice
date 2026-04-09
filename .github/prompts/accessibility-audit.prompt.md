---
description: '審查 UI 元件的可及性問題，確保鍵盤操作、語意 HTML 與 ARIA 屬性符合 WCAG 基本要求'
---

# 可及性審查 Prompt

請協助我審查以下 UI 元件或頁面的可及性問題。

目標：
[請在此填入要審查的元件或頁面]

請檢查：

- 互動元素是否使用語意化 HTML（button、a、input 等）
- 所有 input 是否有對應的 label
- 錯誤訊息是否透過 aria-describedby 與欄位關聯
- 自訂互動元件（dropdown、modal、tab）是否有完整 ARIA 屬性
- 元件是否支援鍵盤操作（Tab 聚焦、Enter/Space 觸發、Escape 關閉）
- Modal 開啟時是否有 focus trap
- 圖片是否有適當的 alt 屬性
- icon-only 按鈕是否有 aria-label
- 動態內容是否有 aria-live 通知
- 色彩對比是否符合 WCAG AA 基準

限制：

- 優先修正高影響問題（鍵盤不可操作、無 label 的表單欄位）
- 保持最小修正範圍

請輸出：

1. 問題列表（依影響程度排序）
2. 風險等級（高：完全無法使用 / 中：部分功能受限 / 低：體驗降低）
3. 最小修正方案
4. 推薦的進一步改善方向
