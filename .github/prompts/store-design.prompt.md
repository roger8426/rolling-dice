---
description: '設計或審查 Pinia store，確保 state 邊界合理、action 聚焦且錯誤處理完整'
---

# Store 設計 Prompt

請協助我設計或審查 Pinia store。

目標：
[請在此填入 store 的業務目標，例如：購物車狀態管理、使用者資料同步等]

請依下列角度評估：

- 這個 state 是否真的需要放進 store（而非 local state 或 composable）
- store 的 domain 邊界是否清楚，是否承擔了不屬於它的責任
- state 結構是否易於更新與閱讀
- getter 是否取代了應用 computed 推導的值
- action 是否聚焦，還是成為了業務流程大容器
- 非同步 action 是否正確處理 loading / error state
- 跨 store 依賴是否合理，是否有循環依賴風險
- store 是否直接暴露了不穩定的 raw API response 結構

限制：

- 不要把 page-only 或一次性的 UI state 放進 store
- action 不應直接呼叫 toast 或 router，應透過回傳值或 callback 讓呼叫端決定
- 不做無授權的大範圍重構

請輸出：

1. 是否合適使用 store（或建議改用其他方案）
2. 問題分析
3. 建議的 store 設計
4. 完整程式碼（含型別）
5. 風險與驗證方式
