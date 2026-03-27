// ================================================================
//  Google Apps Script — 接收問卷資料並寫入 Google 試算表
// ================================================================
//
//  使用步驟：
//  1. 開啟你的 Google 試算表
//  2. 點選「擴充功能」→「Apps Script」
//  3. 把這段程式碼全部貼上（取代原有的 myFunction）
//  4. 點「部署」→「新增部署作業」→「類型選 Web 應用程式」
//  5. 執行身分：「我」；存取權限：「所有人」
//  6. 複製部署後的 URL，貼到 config.json 的 google_sheet_endpoint
// ================================================================

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data  = JSON.parse(e.postData.contents);

    // 若試算表是空的，自動建立標題列
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(Object.keys(data));
      // 凍結標題列並加粗
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, Object.keys(data).length)
           .setFontWeight('bold')
           .setBackground('#d9ead3');
    }

    // 寫入資料列
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

// 測試用（在 Apps Script 編輯器直接執行此函式）
function testWrite() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const sample = {
    timestamp: new Date().toLocaleString('zh-TW'),
    scenario_code: 'JAH+IPH+ERE',
    scenario_JA: 'H',
    scenario_IP: 'H',
    scenario_ER: 'E',
    mc_JA_1: '5', mc_JA_2: '6', mc_JA_3: '5',
    mc_IP_1: '2', mc_IP_2: '3', mc_IP_3: '2',
    task_ER_1: '聆聽需求', task_ER_2: '建立信任', task_ER_3: '',
    mc_ER_1: '2',
    hp_1: '5', hp_2: '6', hp_3: '5', hp_4: '4',
    hp_5: '5', hp_6: '6', hp_7: '5', hp_8: '3',
    hp_9: '2', hp_10: '3', hp_11: '2', hp_12: '2',
    hp_13: '2', hp_14: '3',
    age: '28', gender: '生理男', education: '大學',
    work_years: '3', work_months: '6',
    marital: '未婚', department: '業務銷售'
  };

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(Object.keys(sample));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, Object.keys(sample).length)
         .setFontWeight('bold')
         .setBackground('#d9ead3');
  }
  sheet.appendRow(Object.values(sample));
  Logger.log('測試資料寫入成功');
}
