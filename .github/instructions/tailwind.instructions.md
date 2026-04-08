---
applyTo: '**/*.vue,**/*.tsx,**/*.jsx,components/**/*.ts,components/**/*.vue,pages/**/*.vue,layouts/**/*.vue'
---

# Tailwind 規範

當處理 Tailwind CSS 相關內容時，請遵守以下規則。

## 核心原則

1. 優先使用 Tailwind utility classes 完成樣式，不預設退回自訂 CSS。
2. 樣式應以可讀性、可維護性與一致性為優先，不為了「全都用 class」而犧牲可理解性。
3. 優先使用既有設計語彙與 spacing 規則，不隨意發明尺寸。
4. 同一類型元件應保持一致的 class 結構與互動狀態寫法。
5. 不要在沒有明確價值時堆疊過多 utility classes。
6. Tailwind 的使用目標是提升開發效率與樣式一致性，不是單純縮短 CSS 撰寫時間。

## 使用原則

1. 能直接用 Tailwind utility 解決的樣式，優先直接使用。
2. 若一段 class 過長、重複率高、可辨識性差，應考慮抽出共用元件、`@apply` 或組合策略。
3. 若樣式高度依賴狀態切換，應保持 class 組合邏輯清楚，不可讓 template 難以閱讀。
4. 樣式應配合元件責任，不要把大量視覺邏輯與業務邏輯混在一起。
5. 不要只因為 class 很長就直接抽離，必須先判斷其重複性、穩定性與責任邊界。

## Tailwind v4 與 @theme

### 設定方式

本專案使用 Tailwind v4，不使用 `tailwind.config.ts`。Tailwind 設定透過 CSS 檔案內的 `@import 'tailwindcss'` 引入，design token 透過 `@theme {}` block 定義。

### Token 前綴與分層

1. UI library（`packages/ui/`）使用 `--rui-` 前綴，由元件庫維護。
2. App（`app/`）使用 `--rd-` 前綴，由應用層維護。
3. 兩套 token 系統**徹底分離**，不混用前綴。
4. App 可消費 `--rui-*` token（來自 UI library 的 CSS），但**不應新增** `--rui-*` token。
5. App 自身的樣式擴充（如品牌色、頁面級 spacing）應定義為 `--rd-*` token。

### @theme 使用規則

1. `@theme {}` 內定義的 CSS custom property 會自動註冊為 Tailwind utility 可用值。
2. Token 分層建議：
   - **語意層**：surface、text、border 等通用 UI 語彙
   - **元件層**：card、modal、drawer 等特定元件的 token
3. 新增 token 應遵循既有命名與分層慣例，不隨意建立新的命名空間。

### Token 消費方式

1. 在 Tailwind utility 中直接引用：`bg-(--rd-color-primary)`。
2. 在元件 style 中引用：`var(--rd-color-primary)`。
3. 優先使用既有 token，不隨意建立新的任意值。
4. 若多處使用相同任意值，應評估是否代表 token 缺失，需新增至 `@theme`。

### Dark Mode

1. 透過 `.dark` class 覆寫 `:root` 變數，元件不需做條件判斷。
2. 元件只需使用 token，dark mode 自動透過 CSS 變數切換生效。

### 避免事項

1. 不要在元件內硬編碼 oklch 色值，應使用 token。
2. 不要在 `@theme` 外的地方定義全域性 design token。
3. 不要繞過 token 系統直接使用任意色值。
4. 不要在 app 中定義 `--rui-*` token，也不要在 UI library 中定義 `--rd-*` token。

## class 排列建議

建議 class 依下列邏輯排序，保持一致性與可讀性：

1. layout
   - `block`
   - `flex`
   - `grid`
   - `hidden`
2. positioning
   - `relative`
   - `absolute`
   - `sticky`
   - `top-*`
   - `left-*`
3. box model
   - `w-*`
   - `h-*`
   - `min-w-*`
   - `max-w-*`
   - `p-*`
   - `px-*`
   - `py-*`
   - `m-*`
   - `gap-*`
4. border / radius / background
   - `border`
   - `border-*`
   - `rounded-*`
   - `bg-*`
5. typography
   - `text-*`
   - `font-*`
   - `leading-*`
   - `tracking-*`
6. effects
   - `shadow-*`
   - `opacity-*`
7. interaction
   - `transition-*`
   - `duration-*`
   - `ease-*`
   - `hover:*`
   - `focus:*`
   - `active:*`
   - `disabled:*`
   - `aria-*`

不要求機械式絕對排序，但應盡量維持一致。

## 響應式設計

1. 優先採用 mobile-first。
2. 響應式 class 應只在必要時增加，不要無意義堆疊。
3. 若同一元素存在過多 breakpoint 規則，應檢查版面是否過度複雜。
4. 響應式差異應清楚反映在結構與責任上，而不是大量 patch 式補丁。
5. 若響應式規則已影響可讀性，應考慮拆分結構、子元件或重新整理版面責任。

## 狀態樣式

1. hover、focus、active、disabled、aria state 應保持一致寫法。
2. 狀態 class 不應散亂難讀，必要時應整理成具名 computed class。
3. 對於多狀態元件，應優先讓狀態映射邏輯可讀，而不是在 template 中堆疊大量條件 class。
4. disabled 狀態應同時考慮視覺與互動限制。
5. 狀態樣式應與元件行為一致，不可只做表面樣式處理而忽略互動語意。

## 樣式抽離優先順序

當樣式變得複雜時，應依下列順序評估抽離方式：

1. 若只是少量條件切換，優先整理為可讀的 `computed` class 或 helper。
2. 若同一組 utility class 在多處重複出現，且樣式語意穩定，可考慮抽成 `@apply`。
3. 若重複的不只是樣式，還包含結構、狀態、互動或變體邏輯，優先考慮抽成共用 component。
4. 若樣式差異主要來自變體組合，而非完整結構重複，可考慮使用 variant mapping。
5. 若抽離後反而讓樣式來源更難追蹤，應保留原本顯式 utility class。

## `@apply` 使用規則

1. 當 utility class 過長，且具有明確重用機會時，可建議抽出為 `@apply`。
2. 適合抽成 `@apply` 的前提：
   - 樣式語意穩定
   - 在多處重複出現
   - 不依賴過多動態條件
   - 抽出後可提升可讀性與一致性
3. 若 class 雖長，但僅出現一次、或高度依賴當前元件上下文，則不應為了簡化視覺長度而強行抽出。
4. 若樣式同時包含結構、狀態、尺寸、變體與業務差異，應先評估是否更適合抽成共用 component、variant mapping 或 helper，而非直接使用 `@apply`。
5. 使用 `@apply` 的目的應是提升重用性、一致性與可讀性，不是單純隱藏冗長 class。
6. 不要讓 `@apply` 取代 Tailwind 原本清楚直接的 utility 寫法；只有在重複與維護成本明確存在時才使用。
7. 若樣式主要差異來自響應式規則、狀態條件或動態組合，通常不應優先抽成 `@apply`，而應先保持 utility class 顯式可讀。

## 條件 class

1. 少量條件 class 可直接在 template 使用。
2. 若條件邏輯複雜，應提取成 `computed` 或 helper。
3. 不要讓 `:class` 變成大型條件運算中心。
4. 物件型與陣列型 class 寫法都可以，但需以可讀性優先。
5. 當 class 的組合邏輯已成為視圖理解障礙時，應考慮整理成具名邏輯層，而非繼續擴張 template。

## 元件化原則

1. 若多個地方出現相同 class pattern，優先考慮抽成共用 component，而不是複製貼上。
2. 不要過早抽象純樣式封裝，需先確認重用價值。
3. 若 class pattern 已反覆出現且變體規則清楚，可考慮：
   - 抽成 base component
   - 抽成 variant mapping
   - 抽成 helper function
4. 若樣式重複同時伴隨結構重複，應優先考慮 component 抽象，而不是只抽 class。

## 與自訂 CSS 的邊界

1. 以下情況可考慮補充自訂 CSS：
   - Tailwind 難以清楚表達的複雜動畫
   - 第三方元件覆寫
   - 極少數重複性極高但 utility 過長的樣式
2. 不要因為個人習慣而過早退回大量 scoped CSS。
3. 若使用自訂 CSS，需保持責任單一，避免與 utility class 打架。
4. 自訂 CSS 應作為補充工具，而不是預設主路徑。

## 任意值使用規則

1. 優先使用既有 Tailwind spacing、size、color、radius、shadow token。
2. 只有在設計稿或實際版面需求無法由既有 token 合理表達時，才使用任意值。
3. 若同一任意值重複出現多次，應評估是否代表設計 token 缺失，或應抽成可重用樣式。
4. 不要用任意值作為微調捷徑來掩蓋結構或布局問題。
5. 任意值應被視為例外，而不是常態。

## 設計一致性

1. spacing、font size、radius、shadow 應盡量沿用既有設計尺度。
2. 顏色、互動、禁用、警示等語彙應在全專案保持一致。
3. 不要隨意混用多種風格的按鈕、卡片、輸入框樣式。
4. 樣式修改應考慮是否破壞既有 UI 一致性。
5. 若需要新增新的視覺語彙，應先確認是否真的屬於新設計需求，而不是局部臨時修補。

## Vue / Nuxt 使用建議

1. template 內 class 應保持可讀性，不要讓視覺樣式掩蓋結構。
2. 若一個 component 的 class 已長到影響理解，優先考慮拆出子元件。
3. page 層不要堆積過多細節樣式，複雜 UI 區塊應由子元件承擔。
4. 與業務邏輯無關的樣式組合，應盡量留在展示層。
5. component 的主要責任若已不是展示，則不應再同時承擔大量樣式編排細節。

## 避免事項

1. 不要在單一元素上堆疊過量 utility 導致不可讀。
2. 不要把複雜條件 class 直接全部塞進 template。
3. 不要為了快速修補而加入大量互相衝突的 class。
4. 不要同時混用大量 Tailwind 與大量 scoped CSS，造成維護困難。
5. 不要無節制使用任意值（例如 `w-[237px]`、`mt-[13px]`），除非有明確設計需求。
6. 不要在沒有設計系統依據下隨意新增顏色、尺寸、陰影風格。
7. 不要用樣式技巧掩蓋結構問題，應優先修正 component 邊界與布局責任。
8. 不要把 `@apply` 當作隱藏冗長 class 的萬用工具。
9. 不要因為 Tailwind 可快速堆疊而忽略長期維護成本。

## 輸出要求

當生成或重構 Tailwind 相關程式碼時，應優先做到：

1. class 結構清楚
2. 狀態樣式一致
3. 響應式策略合理
4. 避免過度冗長
5. 必要時主動建議拆分 component、整理 class 組合，或評估是否適合抽成 `@apply`
