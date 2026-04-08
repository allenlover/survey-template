# Factorial Design Survey Template

彰化師範大學人力資源管理研究所
故事情境法（Scenario-based Method）問卷模板

---

## 檔案說明

| 檔案 | 說明 |
|---|---|
| `index.html` | 問卷主頁面（不需要修改） |
| `config.json` | ★ 研究設定檔（每次新研究只改這個）|
| `apps-script.gs` | Google 試算表接收腳本 |
| `ai_guide.md` | 不熟悉設定時，把此檔連同 config.json 丟給 AI，AI 會引導你完成設定 |
| `README.md` | 本說明文件 |

---

## 每次新研究（學弟妹使用流程）

### Step 1：Fork 或 Use template
先辦github帳號，然後在此頁面，右上點「Fork」（或「Use this template」），建立自己的副本

### Step 2：建立 Google 試算表 + 部署接收腳本
1. 建立新的 Google 試算表（空白即可）
2. 點「擴充功能」→「Apps Script」
3. 把 `apps-script.gs` 的內容全部貼上
4. 點「部署」→「新增部署作業」
5. 類型選「**Web 應用程式**」
6. 執行身分：「我」；存取權限：「**所有人**」
7. 點「部署」→ 複製產生的 URL

### Step 3：修改 config.json
只需要修改以下內容：

```json
{
  "study": {
    "name": "你的研究題目",
    "researcher": "你的名字",
    "advisor": "指導教授",
    "institution": "學校系所",
    "contact_email": "你的信箱",
    "google_sheet_endpoint": "貼上 Step 2 複製的 URL"
  },
  "survey_order": ["因子ID", "量表ID", ...],
  "factors": [
    每個 factor 的情境文字和操弄確認題...
  ],
  "scales": [
    每個量表的題目和角色（role: x / mediator / moderator / y）...
  ]
}
```

> **不知道怎麼填？** 打開 `ai_guide.md`，把裡面的內容連同你的 `config.json` 一起貼給 AI，AI 會逐步問你研究架構、情境文字、量表題目，最後幫你產出完整的 config.json

### Step 4：上傳更新的 config.json 到 GitHub
直接在 GitHub 網頁上編輯，或重新上傳

### Step 5：分享問卷連結
你的 GitHub Pages URL 就是問卷連結，可以直接貼到 LINE / Facebook 發放

---

## config.json 說明

### Factor 類型

**一般情境型**（`manipulation_type: "scale"`）：
- 顯示情境文字
- 接著 Likert 量表操弄確認題

**任務型**（`manipulation_type: "task_then_scale"`）：
- 顯示共享情境文字（`scenario_shared`）
- 顯示任務（開放式填答欄位）
- 接著 Likert 量表操弄確認題

### Scale 類型（`scales` 陣列）

每個量表是獨立一頁，可與 factor 頁交叉排列。每個量表需設定：

| 欄位 | 說明 |
|---|---|
| `id` | 英文縮寫，如 `HP`、`MC`，也作為資料欄位前綴 |
| `role` | 變項角色：`x` / `mediator` / `moderator` / `y` |
| `name` | 量表名稱 |
| `items` | 量表題目陣列 |
| `scale` | `{ "points": 7, "labels": [...] }` |

### 頁面順序（`survey_order`）

`survey_order` 陣列決定問卷頁面順序，可讓 factor 頁和 scale 頁任意交叉。

```json
"survey_order": ["JA", "MC", "IP", "HP"]
```

若省略此欄位，預設為所有 factor 頁在前、所有 scale 頁在後。

### 支援的設計

| 設計 | 支援 |
|---|---|
| 單因子 1×2 | ✅ |
| 雙因子 2×2 | ✅ |
| 三因子 2×2×2 | ✅ |
| 每因子 3 個 level | ✅（在 levels 陣列加第三個） |
| 多量表（mediator、moderator、Y）| ✅（`scales` 陣列） |

### 隨機分派說明
每位受訪者開啟問卷時，系統自動隨機分派到其中一個情境組合。
採用簡單隨機法（Simple Randomization），大樣本下各組分配會趨於平衡。

---

## 資料欄位說明

每筆資料包含以下欄位：

| 欄位 | 說明 |
|---|---|
| timestamp | 填答時間 |
| scenario_code | 情境代碼，如 JAH+IPH+ERE |
| scenario_JA / _IP / _ER | 各 factor 被分派的 level |
| mc_JA_1~3 | JA 操弄確認題 1-3 |
| mc_IP_1~3 | IP 操弄確認題 1-3 |
| task_ER_1~N | 開放式任務填答 |
| mc_ER_1 | ER 難易度評分 |
| hp_1~14 | 和諧式熱情量表 |
| age / gender / education... | 基本資料 |

---

## 問題排除

**問卷載入空白？**
→ 確認 `config.json` 與 `index.html` 在同一個資料夾

**資料沒有進試算表？**
→ 確認 Apps Script 部署時「存取權限」設為「所有人」
→ 可先在 config.json 把 endpoint 留空，開 Console 確認 payload 格式正確

**測試模式**
把 `google_sheet_endpoint` 設為空白或 `YOUR_APPS_SCRIPT_URL_HERE`，
送出時會把資料印到瀏覽器 Console（按 F12 查看），方便測試。

---

## 聯絡

如有問題請聯絡實驗室研究生或參考 `config.json` 內的聯絡資訊。
