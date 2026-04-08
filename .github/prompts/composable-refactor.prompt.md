---
description: "評估邏輯是否適合抽成 composable，並輸出重構方案與風險"
---

# Composable 重構 Prompt

請將以下邏輯評估是否適合抽成 composable，並在適合時進行重構。

目標：

- 降低 component 複雜度
- 提升重用性
- 保持行為一致

限制：

- composable 不直接操作 DOM
- 回傳值請區分 state / computed / actions
- 不要因為抽象而抽象
- 不要改動 API contract，除非我明確要求

請輸出：

1. 是否值得抽離
2. 問題分析
3. composable 設計
4. 重構後程式碼
5. 風險與驗證項目
