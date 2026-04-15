# 開發待辦事項

---

## 一、ai_guide.md 補強

> 目標：讓 AI 引導產出的 config.json 能直接使用，不需要手動補欄位。

- [ ] **補充情境文字 HTML 格式說明**
  - 告知 AI 使用 `<strong>` 表示粗體、`<u>` 表示底線、`\n\n` 表示分段
  - 目前 AI 不知道要加格式，產出的情境文字會是純文字

- [ ] **補充 `cover` 封面同意書區塊**
  - 目前完全沒有引導這個區塊
  - 需要引導填寫：`target_description`（受試對象描述）、`body`（說明文字）、`privacy`（隱私聲明）、`reminder`（填答提醒）

- [ ] **補充遺漏的 `study` 欄位**
  - `title`：問卷頁籤標題（例如「學術問卷」）
  - `contact_phone`：聯絡電話

- [ ] **補充 `part_title` 說明**
  - 每個 factor 和 scale 都有「第一部分」、「第二部分」等標題欄位
  - 目前 AI 不知道要問，會產出空白或遺漏此欄位

- [ ] **新增最終驗證清單**
  - AI 產出 config.json 前，逐項確認必填欄位是否完整
  - 特別提示哪些欄位可能仍為空白（如 `google_sheet_endpoint`）

---

## 二、區組隨機化配額控制（Block Randomization Quota）

> 目標：讓每個實驗組別的樣本數能事先控制，避免各組人數不均。

### 設計概念
研究者在 config.json 設定每組預計份數 → Apps Script 預先產生隨機排列的分派佇列 → 受測者開問卷時從佇列依序取得組別（對受測者看起來是隨機，實際上各組已預先平衡）。

### 待辦項目

- [ ] **`config.json`：新增配額欄位**
  - 新增 `quota_per_cell`（整數，每個組合的目標份數）
  - 例：2×2×2 設定 30，總共預產 240 筆佇列

- [ ] **`apps-script.gs`：新增佇列產生函式**
  - `generateAssignmentQueue()`：根據 config 產生所有組合，各複製 `quota_per_cell` 次後隨機洗牌
  - 寫入試算表的「Queue」工作表
  - 欄位：`assignment_id`、`condition_code`、`status`（pending / in_progress / completed）、`assigned_at`、`completed_at`

- [ ] **`apps-script.gs`：新增 GET 端點**
  - `doGet()`：從佇列取下一筆 `pending`，改為 `in_progress`，回傳組別代碼
  - 使用 `LockService` 防止同時多人取到同一筆
  - 支援 CORS，讓 GitHub Pages 可以跨域讀取回傳值

- [ ] **`apps-script.gs`：新增逾時回收機制**
  - 定時（或在每次 GET 時）掃描 `in_progress` 超過 30 分鐘未完成的筆數
  - 將狀態改回 `pending`，讓該筆重新進入可分派的佇列

- [ ] **`apps-script.gs`：POST 端點補充**
  - 收到問卷送出時，將對應 `assignment_id` 的狀態改為 `completed`，記錄 `completed_at`

- [ ] **`index.html`：修改 `assignScenario()`**
  - 若 config 有設定 `quota_per_cell`，改為向 Apps Script GET 端點請求組別
  - 收到組別代碼後解析（如 `JAH+IPL+ERE`），設定對應的 `scenario` 物件
  - 將 `assignment_id` 暫存，送出問卷時一併帶入 payload
  - 若 GET 失敗（佇列已滿 / 網路錯誤），顯示友善提示訊息（如「本問卷已達收件上限，感謝您的支持」）
  - 若未設定 `quota_per_cell`，維持原本的簡單隨機分派

- [ ] **`後輩使用指南.md`：補充配額設定說明**
  - 說明如何設定 `quota_per_cell`
  - 說明如何在 Apps Script 執行 `generateAssignmentQueue()` 產生佇列
  - 說明如何確認佇列已正確產生
