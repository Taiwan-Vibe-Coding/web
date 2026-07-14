# AppSource 公開文件站（GitHub Pages）

> **公開網址**：https://taiwan-vibe-coding.github.io/web/  
> **原始碼 repo**：`taiwan-vibe-coding/web`（public）  
> **編輯來源**：本 monorepo 的 `docs-site/`（private [`platform`](https://github.com/taiwan-vibe-coding/platform)）

主 monorepo 為 **private**，AppSource 法律／說明 URL 須指向此 **public** Pages 站，勿使用 `github.com/.../blob/main/...`。

## 同步到 public repo

```bash
# 自 monorepo 根目錄
./scripts/sync_appsource_docs.sh
```

腳本會將 `docs-site/`（含截圖與 Pages workflow）推送到 `docs`，並把穩得課堂靜態教材推到 `docs/wendell/`（**不**掛上 AppSource 首頁連結）。重拍 Partner Center 截圖後執行本腳本即可同步至公開手冊。

| 路徑 | 網址 |
|------|------|
| AppSource 文件 | https://taiwan-vibe-coding.github.io/web/ |
| 穩得四天課 HTML | https://taiwan-vibe-coding.github.io/web/wendell/ |

教材來源：`projects/wendell/docs/curriculum-site/`（含 Bearer 的 `_print/` 列印檔不會同步）。

## 截圖

| 路徑 | 用途 |
|------|------|
| `assets/screenshots/p2/` | 薪資設定、試算、級距（來自 `products/tw-payroll/bc/media/`） |
| `assets/screenshots/p4/` | 發票設定、Log、銷售發票列表 |

## app.json 對應 URL

| 欄位 | URL |
|------|-----|
| privacyStatement | https://taiwan-vibe-coding.github.io/web/privacy.html |
| EULA | https://taiwan-vibe-coding.github.io/web/eula.html |
| help（Payroll BC） | https://taiwan-vibe-coding.github.io/web/help/payroll.html |
| help（TW Payroll BC 操作） | https://taiwan-vibe-coding.github.io/web/help/payroll-operations.html |
| help（E-Invoice BC） | https://taiwan-vibe-coding.github.io/web/help/einvoice.html |
| help（TW E-Invoice BC 操作） | https://taiwan-vibe-coding.github.io/web/help/einvoice-operations.html |
| 入門指南 | https://taiwan-vibe-coding.github.io/web/getting-started.html |
| url | https://taiwan-vibe-coding.github.io/web/ |

## 首次啟用 Pages

1. GitHub → `docs` → **Settings** → **Pages**
2. **Build and deployment** → Source：**GitHub Actions**
3. push 後 `Deploy GitHub Pages` workflow 會自動發佈

## 之後換自訂網域

於 Pages 設定 CNAME（例如 `docs.taiwan-vibe-coding.com`），並更新 `products/tw-payroll/bc/app.json`、`tw-einvoice/bc/app.json` 四個 URL 前綴即可。
