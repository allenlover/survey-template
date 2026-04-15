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

- [x] **`config.json`：新增 `quota_per_cell` 欄位**（預設 0，關閉時使用簡單隨機）

- [x] **`apps-script.gs`：新增佇列產生函式 `generateAssignmentQueue()`**
  - 自動從 GitHub Pages 抓取 config.json，產生所有組合並洗牌
  - 寫入試算表的「Queue」工作表
  - 欄位：`assignment_id`、`condition_code`、`status`、`assigned_at`、`completed_at`

- [x] **`apps-script.gs`：新增 GET 端點 `doGet()`**
  - 從佇列取下一筆 `pending`，改為 `in_progress`，回傳組別代碼與流水號
  - 使用 `LockService` 防止同時多人取到同一筆

- [x] **`apps-script.gs`：新增逾時回收機制**
  - 在每次 GET 時掃描 `in_progress` 超過 30 分鐘未完成的筆數
  - 將狀態改回 `pending`，重新進入可分派的佇列

- [x] **`apps-script.gs`：POST 端點補充**
  - 收到問卷送出時，將對應 `assignment_id` 的狀態改為 `completed`
  - 資料改寫入 `Responses` 工作表（與 Queue 分開）

- [x] **`index.html`：修改 `assignScenario()` 為 async**
  - 有 `quota_per_cell > 0` 時向 Apps Script GET 端點請求組別
  - 收到組別代碼後解析（如 `JAH+IPL+ERE`），設定 `scenario` 物件
  - 佇列滿了顯示「本問卷已達收件上限」
  - 未設定 `quota_per_cell` 或請求失敗時退回簡單隨機分派

- [x] **文件更新**
  - `README.md`：加入 SURVEY_URL 設定、配額控制說明、新資料欄位、完整流程
  - `後輩使用指南.md`：加入 SURVEY_URL 填寫步驟、Step 5 配額佇列產生步驟
