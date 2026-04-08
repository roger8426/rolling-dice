---
applyTo: '**/*.vue,**/*.ts,pages/**/*.vue,components/**/*.vue,composables/**/*.ts,nuxt.config.ts'
---

# 效能優化規範

當實作、審查或重構涉及效能敏感場景時，請遵守以下規則。

> ⚠️ 本專案第一版 MVP 使用 SPA 模式（`ssr: false`）。CSR 效能規則為當前優先適用標準；SSR 相關效能建議為前瞻性保留。

## 核心原則

1. 效能優化的前提是正確性與可維護性，不以犧牲可讀性換取微觀效能提升。
2. 優先解決影響使用者感知的效能問題（首屏、互動延遲），而非純數字優化。
3. 不要在沒有明確效能問題時進行預防性過度優化。
4. 每次優化應有可觀察的依據（Lighthouse 分數、LCP、INP、bundle size report 等）。

## Component 載入優化

1. 非首屏必要的 component，應使用 `defineAsyncComponent` 進行非同步載入：
   ```ts
   const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))
   ```
2. Nuxt 的 `lazy` 前綴可自動轉換 component 為 lazy import：
   ```html
   <LazyHeavyComponent v-if="visible" />
   ```
3. 避免在 layout 或高頻渲染元件中直接靜態 import 重型 component。
4. 僅用於 client 端的第三方 Widget，可使用 `<ClientOnly>` 包裹（SSR 啟用後必要）。

## 路由與頁面載入優化

1. Nuxt 會自動對 pages 進行 code splitting，不需手動處理頁面分割。
2. 跨頁跳轉前可使用 `prefetchComponents` 或 `preloadComponents` 手動控制預載。
3. 避免在 `app.vue` 或 `layouts/default.vue` 中 import 僅特定頁面需要的大型依賴。

## 資料取得效能

1. 若同一頁面需要多個資料來源，應使用 `Promise.all` 或多個並行的 `useAsyncData`，而非序列等待。
2. 考慮設定適當的 `getCachedData`，避免頁面重新進入時重複取得已有資料：
   ```ts
   useAsyncData('key', fetcher, {
     getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key],
   })
   ```
3. SPA 下首屏資料請求應盡早觸發，避免元件 mount 後才開始 fetch。
4. 未來啟用 SSR 後，優先讓 `useAsyncData` 在 server 端完成首屏資料取得，減少 client 端 waterfall。
5. server route 可加入 HTTP cache header，對靜態或低頻更新資料進行 CDN 快取（SSR 啟用後適用）。

## SPA / CSR 效能重點

1. SPA 無 SSR 首屏 HTML，首屏效能完全取決於 bundle 載入速度與 client-side render 時間。
2. Bundle 體積管理優先級更高，直接影響 FCP / LCP。
3. 路由層級 code splitting（Nuxt 自動處理）搭配非首屏元件 lazy loading 是基本策略。
4. Loading skeleton 是 SPA 使用者感知效能的關鍵手段，首屏資料載入時必須有明確的視覺回饋。
5. 首屏資料請求應盡早觸發（在 page setup 階段），避免等到元件 mount 後才開始 fetch。

## Bundle 體積管理

1. 新增依賴前，先確認是否真實需要，評估套件大小（可使用 `bundlephobia.com`）。
2. 有 tree-shaking 支援的套件，應使用具名 import，而非整體 import：
   ```ts
   // 好
   import { format } from 'date-fns'
   // 避免
   import * as dateFns from 'date-fns'
   ```
3. 可使用 `nuxt analyze`（或 `vite-bundle-visualizer`）定期審視 bundle 組成。
4. 大型工具函式庫（如 lodash）在 Nuxt 3 / ESM 環境下，應優先考慮 `lodash-es`。

## 圖片與靜態資源優化

1. 優先使用 Nuxt Image（`@nuxt/image`）處理圖片，自動支援格式轉換（WebP/AVIF）、lazy loading 與 responsive sizes。
2. 使用 `<NuxtImg>` 取代原生 `<img>`：
   ```html
   <NuxtImg src="/hero.jpg" width="800" height="400" loading="lazy" />
   ```
3. LCP（最大內容繪製）相關圖片應加上 `loading="eager"` 或 `fetchpriority="high"`，不使用 lazy。
4. 不要將大型圖片或影片直接放入 `assets/`，應使用 CDN 或 object storage。
5. SVG icon 若大量使用，應考慮 inline sprite 或 icon 元件，避免重複請求。

## 渲染效能

1. 大量清單渲染應使用 `:key` 保持穩定性，避免不必要的 DOM 重建。
2. 若清單資料量大（>500 筆），應考慮虛擬捲動（virtual scrolling）方案。
3. 重計算成本高的數值，使用 `computed` 進行快取，避免在 template 中直接呼叫函式。
4. 避免使用深層 `watch`（`{ deep: true }`）監聽大型物件，優先改為精確追蹤。
5. 若 component 不依賴響應式資料，可考慮使用 `v-once` 靜態渲染。

## Web Vitals 關注指標

| 指標                     | 說明                 | 優先策略                                                                         |
| ------------------------ | -------------------- | -------------------------------------------------------------------------------- |
| **LCP** 最大內容繪製     | 首屏主要內容載入時間 | 圖片最佳化、減少 render-blocking、SPA 下優先降低 bundle 體積                     |
| **INP** 互動到下一幀繪製 | 使用者互動響應延遲   | 避免長任務、降低 JS 執行量                                                       |
| **CLS** 累積版面位移     | 頁面載入期間意外位移 | 圖片設定寬高、避免動態插入影響版面、loading skeleton 預留空間                    |
| **TTFB** 首位元組時間    | Server 回應速度      | SPA 下取決於靜態資源 hosting；SSR 啟用後可透過 server route 快取、CDN、Edge 優化 |

## Nuxt 特定建議

> 以下部分建議為未來啟用 SSR 後適用，SPA 模式下僅適用標注的項目。

1. 靜態內容頁面考慮使用 `nuxt generate` 預先生成，避免每次 SSR 重算（SSR 啟用後適用）。
2. 若使用 Nuxt Middleware，確認不在其中執行高延遲操作（如不必要的 API 呼叫）。
3. 使用 `useRequestEvent` 或 `cachedFunction`（Nitro）為 server function 增加快取層（SSR 啟用後適用）。
4. 關注 `payload` 大小，避免把過多資料序列化並傳遞給 client（SSR 啟用後適用）。

## 效能測量工具

在進行任何效能優化前，應先透過工具確認問題根因，而非依賴猜測：

1. **Lighthouse**（Chrome DevTools）— 評估 LCP、INP、CLS、TTFB 等 Web Vitals 指標。
2. **Chrome Performance 面板** — 分析 Long Tasks、JS 執行時間、重渲染原因。
3. **Vue DevTools**（Profiler 分頁）— 追蹤 Vue component 渲染次數、渲染耗時、props 變化原因。
4. **`nuxt analyze`** — 分析 bundle 組成，找出過重的依賴模組。
5. **Network 面板** — 確認首屏資源載入順序、waterfall 瓶頸、不必要的重複請求。

優化原則：先測量，再優化；優化後再測量確認改善。

## 避免事項

1. 不要在 `mounted` 中執行會阻塞 render 的同步大量計算。
2. 不要在高頻事件（`scroll`、`resize`、`mousemove`）的 handler 中直接執行重計算，應使用 throttle 或 requestAnimationFrame。
3. 不要讓 template 直接呼叫無快取的 method 進行複雜運算，應改為 `computed`。
4. 不要在 SSR 環境執行僅供 client 使用的效能優化（如 intersection observer），需加 client guard（SSR 啟用後適用）。
5. 不要為了效能數字犧牲程式碼可讀性，效能問題應被測量，而不是被猜測。

## 輸出要求

當進行效能相關審查或實作時，應優先做到：

1. 指出效能問題的可能根因（非猜測）
2. 提供可落地的最小改善方案
3. 說明優化後可觀察的改善點
4. 對多方案取捨提供清楚說明
5. 若涉及架構調整，需結合最小改動原則，提出分步方案
