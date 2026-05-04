# Rolling Dice

D&D 角色建立工具。Nuxt 3 SPA + `packages/ui` Vue 元件庫（git submodule）。

## 第一次 clone 後的設定

```sh
pnpm install   # 安裝依賴，並自動設定 git hooks
pnpm init:ui   # 初始化 UI submodule、安裝依賴、打包
pnpm dev       # 啟動開發伺服器 http://localhost:3000
```

> `pnpm install` 會透過 `prepare` script 設定 `core.hooksPath .githooks`，之後的 git hooks 才會生效。
> 未執行 `pnpm init:ui` 時，`@ui` alias 指向尚未產出的 `packages/ui/dist/`，dev / build 會失敗。

## 日常開發

```sh
pnpm dev        # 開發伺服器
pnpm update:ui  # 更新並重新打包 UI submodule
```

## 型別檢查 / Lint / Format

```sh
pnpm type-check    # nuxi typecheck
pnpm lint          # oxlint --fix → eslint --fix
pnpm lint:check    # 僅檢查不修改
pnpm format        # prettier --write
```

> commit 時 `lint-staged` 會自動跑 oxlint → eslint → prettier，請勿用 `--no-verify` 繞過。

## 測試

```sh
pnpm test:unit       # vitest（watch 模式）
pnpm test:unit:ci    # vitest --run（單次）
pnpm test:coverage   # 覆蓋率報告（門檻 80%）
```

執行單一測試檔：`pnpm test:unit app/tests/unit/stores/character.spec.ts`
依測試名稱過濾：`pnpm test:unit -t "部分名稱"`

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
├─ docs/               # 設計規格與 review 紀錄
├─ .claude/skills/     # Claude Code 用的領域規範
├─ nuxt.config.ts
└─ package.json
```

### app/ 主要目錄

| 目錄                  | 用途                                                          |
| --------------------- | ------------------------------------------------------------- |
| `components/`         | Vue 元件（`common` / `layout` / `business`）                  |
| `composables/domain/` | 業務領域 composable（角色、戰鬥、法術、庫存等）               |
| `composables/ui/`     | UI 行為 composable（toast、手勢等）                           |
| `helpers/`            | 含業務語意的純函式（規則計算、分級判斷）；Nuxt auto-import    |
| `utils/`              | 不含業務語意的通用工具（debounce、字串、localStorage 封裝等） |
| `stores/`             | Pinia 跨元件 / 跨頁面共享狀態                                 |
| `pages/`              | Nuxt file-based routing；只負責組裝與 orchestration           |
| `layouts/`            | Nuxt 版面                                                     |
| `types/`              | Domain type，分 `business` / `common` / `layout`              |
| `constants/`          | 常數（規則表、列舉等）                                        |
| `mocks/`              | 測試與開發用 mock 資料                                        |
| `tests/`              | Vitest 測試（非 colocated，集中於 `app/tests/**/*.spec.ts`）  |

詳細開發規範與分層原則請參考根目錄 `CLAUDE.md` 與 `.claude/skills/`。
