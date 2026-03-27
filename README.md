# 故事情境法隨機分派問卷使用指南：如何用這個模板做你自己的問卷

## 你需要的東西
- 一個 GitHub 帳號（免費）
- 一個 Google 帳號（用來建試算表）

---

## Step 1：Fork repo

1. 點右上角「**Fork**」
2. 點「**Create fork**」
3. 你現在有自己的副本了，之後所有操作都在你自己的副本上
                                                                                                                                                                                   
  ---                                                                                                                                                                               
  Step 2：Google 試算表 + Apps Script 設定指南                                                                                                                                                   
  目標 完成後你會有：
  - 一個 Google 試算表（用來收問卷資料）                                                                                                                                            
  - 一個 Apps Script Web App URL（貼到 config.json）        

  ---
  2-1：建立 Google 試算表
                                                                                                                                                                                    
  1. 打開 https://sheets.google.com
  2. 點左上角「＋」新增空白試算表                                                                                                                                                   
  3. 把試算表命名（例如：問卷資料_2026）                    
                                                                                                                                                                                    
  ---
  2-2：開啟 Apps Script                                                                                                                                                             
                                                            
  1. 在試算表頁面，點上方選單「擴充功能」
  2. 點「Apps Script」
  3. 會開啟新分頁，看到一個編輯器，裡面有預設的 myFunction
                                                                                                                                                                                    
  ---
  2-3：貼上腳本                                                                                                                                                                     
                                                            
  1. 把編輯器裡原有的所有內容全部刪除
  2. 複製以下程式碼，全部貼上：
     
  ```   
  function doPost(e) {                                           
    try {                                                   
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const data  = JSON.parse(e.postData.contents);                                                          
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(Object.keys(data));                                                                                                                                         
        sheet.setFrozenRows(1);                             
        sheet.getRange(1, 1, 1, Object.keys(data).length)
             .setFontWeight('bold')                                                                                                                                                 
             .setBackground('#d9ead3');
      }                                                   
      sheet.appendRow(Object.values(data));
      return ContentService
        .createTextOutput(JSON.stringify({ status: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {                                              
      return ContentService                                 
        .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
        .setMimeType(ContentService.MimeType.JSON);                                                        
    }
  }                                                          
  function testWrite() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const sample = {
      timestamp: new Date().toLocaleString('zh-TW'),                                                                                                                                
      scenario_code: 'TEST',
      test: 'ok'                                                                                                                                                                    
    };                                                      
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(Object.keys(sample));
      sheet.setFrozenRows(1);                                            
    }
    sheet.appendRow(Object.values(sample));                                          
    Logger.log('測試成功');                                 
  }
```

  3. 點左上角「儲存」（或按 Ctrl+S / Cmd+S）
  ---                                                                                                                                                                               
  2-4：部署為 Web App                                       

  1. 點右上角「部署」按鈕
  2. 選「新增部署作業」
  3. 點「類型」旁邊的齒輪圖示 ⚙️ ，選「網頁應用程式」
  4. 填寫以下設定：                                               
    - 說明：問卷接收腳本（隨意）
    - 執行身分：「我」                                                  
    - 存取權限：「所有人」← 這個很重要，一定要選這個        
  5. 點「部署」                                                      
  6. Google 可能要求你授權，點「授權存取」→ 選你的 Google 帳號 → 點「進階」→「前往（不安全）」→「允許」
  7. 部署成功後會出現一串 URL，格式像：
  https://script.google.com/macros/s/AKfycb.../exec                                                               
  8. 複製這串 URL（非常重要，之後要用）                                                            
 
  --- 
  
  2-5：更新 config.json                                              
  1. 在你的 repo 頁面點 config.json → 鉛筆圖示編輯
  2. 找到這一行：                                                   
  "google_sheet_endpoint": "YOUR_APPS_SCRIPT_URL_HERE"                                                        
  3. 把 YOUR_APPS_SCRIPT_URL_HERE 換成你剛剛複製的 URL                                                    
  4. Commit 儲存                                                           
                                                            
  ---                                                                                                                                                                               
  2-6：驗證是否成功（選做）
  1. 回到 Apps Script 編輯器
  2. 上方函式選單選「testWrite」
  3. 點「▶ 執行」                                                         
  4. 回到 Google 試算表，應該會看到一筆測試資料自動出現

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
