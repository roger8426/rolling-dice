# Rolling Dice

D&D 角色建立工具。Nuxt 3 SPA + `packages/ui` Vue 元件庫（git submodule）。

## 第一次 clone 後的設定

```sh
pnpm install   # 安裝依賴，並自動設定 git hooks
pnpm init:ui   # 初始化 UI submodule、安裝依賴、打包
pnpm dev       # 啟動開發伺服器 http://localhost:3000
```

> `pnpm install` 會透過 `prepare` script 設定 `core.hooksPath .githooks`，之後的 git hooks 才會生效。

## 日常開發

```sh
pnpm dev       # 開發伺服器
pnpm pull      # git pull 並更新 UI library（主專案有 / 無更新皆適用）
pnpm update:ui # 單獨更新並重新打包 UI library
```

## 型別檢查 / Lint

```sh
pnpm type-check
pnpm lint
pnpm format
```

## 測試

```sh
pnpm test:unit
pnpm test:coverage
```

## 建置

```sh
pnpm generate  # 靜態產出（GitHub Pages）
pnpm preview   # 預覽靜態產出
```

## 專案結構

```
rolling-dice/
├─ app/                # Nuxt 應用（主產品）
├─ packages/ui/        # Vue 元件庫（git submodule）
├─ nuxt.config.ts
└─ package.json
```

詳細結構與開發規範請參閱 `.github/instructions/`。
