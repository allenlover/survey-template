# 故事情境法隨機分派問卷使用指南：如何用這個模板做你自己的問卷

## 你需要的東西
- 一個 GitHub 帳號（免費）
- 一個 Google 帳號（用來建試算表）

---

## Step 1：Fork repo

1. 進入學長姐給你的 GitHub repo 連結
2. 點右上角「**Fork**」
3. 點「**Create fork**」
4. 你現在有自己的副本了，之後所有操作都在你自己的副本上

---

## Step 2：建立你自己的 Google 試算表 + 部署接收腳本

照 `STEP2_Google試算表設定.md` 的步驟操作，完成後你會拿到一串像這樣的 URL：

```
https://script.google.com/macros/s/AKfycb.../exec
```

**把這串 URL 複製起來，Step 3 會用到。**

---

## Step 3：修改你自己的 config.json

1. 在你 fork 後的 repo 頁面，點 `config.json`
2. 點右上角鉛筆圖示「**Edit**」
3. 修改以下欄位：

```json
"study": {
  "name": "你的研究題目",
  "researcher": "你的名字",
  "advisor": "你的指導教授",
  "institution": "你的學校系所",
  "contact_email": "你的信箱",
  "google_sheet_endpoint": "貼上 Step 2 拿到的 URL"
}
```

4. 修改 `factors` 裡的情境文字、量表題目（依你的研究設計調整）
5. 點「**Commit changes**」儲存

---

## Step 4：開啟 GitHub Pages

1. 進入你的 repo → 上方點「**Settings**」
2. 左側選單點「**Pages**」
3. Source 選「**Deploy from a branch**」
4. Branch 選「**main**」，資料夾選「**/ (root)**」
5. 點「**Save**」
6. 等約 1 分鐘，頁面上會出現你的問卷網址：

```
https://你的GitHub帳號.github.io/你的repo名稱/
```

---

## 完成！

把這個連結貼到 LINE / Facebook 開始發放問卷。
資料會自動進入你在 Step 2 設定的 Google 試算表，互不干擾。

---

## 之後要更新問卷內容

1. 在 GitHub repo 頁面點 `config.json`
2. 點鉛筆圖示「**Edit**」
3. 修改後點「**Commit changes**」
4. 約 1 分鐘後問卷自動更新

---

## 常見問題

**問卷開起來空白？**
→ 確認 `config.json` 有成功 commit，且 GitHub Pages 已啟用

**資料沒有進試算表？**
→ 確認 Apps Script 部署時「存取權限」設為「所有人」
→ 回到 Apps Script 編輯器，用 `testWrite()` 函式測試看看

**不知道 config.json 怎麼改？**
→ 參考學長姐原本的 config.json，照格式修改就好
→ 不確定的地方可以問ai，建議用claude code。
