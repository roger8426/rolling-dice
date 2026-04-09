---
applyTo: '**/*.spec.ts,**/*.test.ts,**/*.spec.vue,tests/**,__tests__/**,vitest.config.*'
---

# 測試規範

當處理測試相關檔案、或被要求補充測試時，請遵守以下規則。

## 測試工具

1. 單元測試與整合測試使用 **Vitest**。
2. Vue component 測試使用 **@vue/test-utils**。
3. Nuxt 整合測試可使用 **@nuxt/test-utils**。
4. 除非另有指定，不引入 Jest 或其他測試框架。

## 測試檔案放置原則

1. 單元測試（composables、utils、stores）集中放置於 `tests/unit/`，依來源模組對應子目錄：
   - `tests/unit/composables/`
   - `tests/unit/utils/`
   - `tests/unit/stores/`
2. Vue component 測試放置於 `tests/component/`。
3. Nuxt E2E 或整合測試放置於 `tests/e2e/`（若存在）。
4. 若專案已採用 co-located 慣例（測試檔與原始碼同層），應延續既有規則，不隨意改為集中放置。
5. 測試檔命名與原始碼對應，使用 `.spec.ts` 後綴（例如 `useCart.spec.ts`）。

## 測試對象優先順序

依價值由高到低：

1. **composables** — 包含業務邏輯、狀態協調或副作用的 composable 應優先覆蓋。
2. **utils** — 純函式工具，最易測試、產出穩定，應完整覆蓋。
3. **store actions** — 非同步流程、狀態轉換、錯誤分支需覆蓋。
4. **components** — 優先測試互動行為與 props/emits 契約，不測試內部實作細節。
5. **pages** — 頁面測試成本高，以整合或 E2E 測試處理，不做細部 unit 測試。

## 測試撰寫原則

1. 一個測試驗證一個行為或情境，不要在單一 `it` 中同時驗證多件事。
2. 測試命名應反映業務語意，而非實作細節。
   - 好：`it('當商品數量為 0 時，加入購物車按鈕應禁用')`
   - 不好：`it('should set disabled to true when count eq 0')`
3. 優先使用 `Arrange / Act / Assert` 三段式結構，保持測試可讀性。
4. 避免讓測試相互依賴，每個測試應可獨立執行。
5. 避免對實作細節進行斷言（例如直接斷言內部變數）；應測試可觀察行為。

## Composable 測試

1. 使用 `withSetup` 或 `mountSuspended` 包裝含 lifecycle 的 composable。
2. 測試 composable 的回傳值結構、狀態初始值、以及主要操作後的狀態變化。
3. 非同步 composable 需覆蓋：loading、成功、錯誤三種情境。
4. 若 composable 依賴 Nuxt composable（如 `useRoute`、`useFetch`），應 mock 相依。

## Component 測試

1. 使用 `@vue/test-utils` 的 `mount` 或 `shallowMount`。
2. 優先使用 `shallowMount` 隔離子元件，降低測試複雜度。
3. 測試重點：
   - props 傳入後的 render 結果
   - 使用者互動（click、input）觸發的 emits
   - slot 是否正確渲染
4. 不要斷言 CSS class 細節，除非 class 有可觀察的功能意義。
5. 使用 `data-testid` 選取元素，而非 CSS class 或 HTML 結構。

## Store 測試

1. 使用 `createPinia` 建立測試用 pinia 實例，不共用全域狀態。
2. 覆蓋：初始 state、getter 推導值、action 執行後 state 變化。
3. 有外部 API 呼叫的 action，應 mock 相依的 fetch 函式或 `$fetch`。
4. 覆蓋 action 的錯誤分支，確認 error state 是否正確更新。

## Mock 與 Stub 原則

1. 優先 mock 邊界（API、router、外部服務），不 mock 內部邏輯。
2. 使用 `vi.mock()` 或 `vi.fn()` 建立 mock，避免污染全域。
3. 每次測試後應還原 mock（`vi.resetAllMocks()` 或 `afterEach` 清理）。
4. 不要為了讓測試通過而 mock 過多被測對象的行為。

## 覆蓋率

1. 覆蓋率數字是健康指標，而非終極目標；高覆蓋率不代表品質，低覆蓋率通常是問題訊號。
2. 建議對核心業務邏輯（composables、utils、store actions）設定最低覆蓋率門檻（通常 80% 為基準）。
3. 若專案配置了 `vitest` 的 `coverage` 設定，應確認 `thresholds` 有合理設定，並在 CI 中強制執行。
4. 不要為了達到覆蓋率而撰寫無意義的測試；優先補齊未覆蓋的邊界情境與錯誤分支。

## Snapshot 測試

1. Snapshot 測試適合用於**穩定、以輸出為中心**的場景，例如：固定格式的資料轉換函式輸出、靜態元件結構。
2. **不建議**對複雜 UI 元件廣泛使用 snapshot，原因：
   - 任何 class 或 HTML 微調都會導致 snapshot 失敗，產生大量無意義更新
   - 開發者傾向直接執行 `--update-snapshots` 而不審查差異
3. 若使用 snapshot，應搭配明確的 `describe` 說明用途，並定期審查是否仍反映預期行為。
4. 優先使用行為斷言（`expect(button.disabled).toBe(true)`）取代整體 snapshot 比對。

## 避免事項

1. 不要撰寫只驗證實作細節而不驗證行為的測試。
2. 不要讓測試因為 UI 細節（class 名稱、HTML 結構）的改動就失敗。
3. 不要在測試中直接匯入並操作 store 內部 private 狀態。
4. 不要跳過錯誤分支的測試，error state 是品質保證的重要一環。
5. 不要堆疊大量 mock 來讓測試通過，此通常代表被測對象責任過重。
6. 不要在 CI 外的測試中依賴外部網路或真實環境資源。

## 輸出要求

當補充或審查測試時，應優先做到：

1. 確認測試目標是行為，而非實作
2. 確認非同步情境（loading、error、success）都有覆蓋
3. 確認 mock 範圍合理，不過度 mock
4. 確認命名語意清楚，同仁可從測試清單理解功能預期
5. 若測試複雜度高，應提示被測對象可能責任過重，建議拆分
