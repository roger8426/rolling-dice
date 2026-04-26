---
name: pinia-conventions
description: Pinia store 規範 — 使用時機、state/getter/action 設計、storeToRefs、非同步 action loading/error 處理、跨 store 依賴與避免的反模式。當編輯 stores/ 或檔名含 store 的 .ts 檔時自動參考。
paths: app/stores/**,app/**/*store*.ts
---

# Pinia 規範

當處理 Pinia store 時，請遵守以下規則。

## Store 使用時機

1. 只有真正跨 component 或跨 page 共享的狀態才放入 store。
2. 單頁一次性 UI state 預設放在 local state 或 composable。
3. 不要將暫時狀態無條件提升為全域狀態。

## Store 設計原則

1. store 應聚焦單一 domain 或清楚責任。
2. action 不要膨脹成全能 service layer。
3. state 結構需易於更新、易於理解。
4. 盡量避免 store 同時承擔 transport、mapping、toast、router、UI side effects。

## State / Getter / Action

1. state 僅保存必要共享資料。
2. 推導值優先使用 getter 或外層 computed。
3. action 命名需具語意。
4. 非必要時不要把所有非同步流程都塞進 store。

## 型別與資料邊界

1. store state 型別需清楚。
2. 外部資料進 store 前，應經過必要 mapping。
3. 不要讓 store 直接暴露不穩定 raw response 結構。

## storeToRefs 使用

1. 從 store 解構響應式 state 或 getter 時，必須使用 `storeToRefs`，否則會失去響應性：
   ```ts
   const store = useCartStore()
   const { items, totalPrice } = storeToRefs(store) // 保持響應性
   const { addItem, removeItem } = store // action 直接解構即可
   ```
2. action 不需透過 `storeToRefs` 解構，直接從 store 取得即可。
3. 若整個 store 都需要保持響應性，可直接使用 store 物件，不強制解構。

## 非同步 Action 設計

1. 非同步 action 應明確更新 loading 與 error 狀態，不讓呼叫端猜測執行情況。
2. 建議在 state 中定義配套的 loading / error 欄位：
   ```ts
   state: () => ({
     items: [] as CartItem[],
     status: 'idle' as 'idle' | 'pending' | 'success' | 'error',
     error: null as string | null,
   })
   ```
3. action 的 try/catch 必須在 catch 中更新 error state，不可靜默忽略。
4. action 不應在內部直接呼叫 toast 或 router；應透過回傳值讓呼叫端決定後續行為。
5. 若同一個 action 會被多處呼叫，須注意並發執行下的競態條件（race condition）。

## 跨 Store 依賴

1. 若 store A 需要 store B 的資料，應在 action 或 getter 內部呼叫 `useOtherStore()`，而非在 state 初始化時直接建立依賴。
2. 避免雙向依賴（store A 依賴 store B，store B 又依賴 store A），此為循環依賴風險。
3. 若跨 store 依賴過於複雜，應先評估是否為 store 邊界設計問題，考慮重新劃分 domain。
4. 共用的資料邏輯應優先考慮放在 composable，而非強迫多個 store 互相引用。

## 避免事項

1. 不要把 loading/error 全部都塞在單一巨大 store。
2. 不要讓 store 變成難以維護的共享垃圾桶。
3. 不要讓 page-only 視覺狀態進入全域 store。
