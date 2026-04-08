---
description: "從 Nuxt 3 最佳實務角度審查頁面，SSR/CSR 邊界、hydration、data fetching 等"
---

# Nuxt 頁面審查 Prompt

請從 Nuxt 3 最佳實務角度審查以下內容。

請檢查：

- SSR / CSR 邊界
- hydration mismatch 風險
- useAsyncData / useFetch / $fetch 使用是否合理
- page 是否責任過重
- middleware / plugin / server route 分工是否合理
- 是否有未防護的瀏覽器 API 使用

請輸出：

1. 問題列表
2. 風險等級
3. 最小修正方案
4. 可選的深度重構方向
