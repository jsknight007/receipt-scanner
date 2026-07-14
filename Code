/**
 * Ledger Lite v10 - Apps Script
 * All operations via doGet for proper CORS handling.
 */

const TOTAL_COLUMNS = 15;
const HEADERS = [
  "Receipt Date", "", "Item Number", "Description",
  "Quantity", "Price Per Unit", "Total Price",
  "", "", "", "Payment Type", "Category",
  "Rebate Number", "Rebate Description", "Store"
];

function doGet(e) {
  try {
    const params = (e && e.parameter) ? e.parameter : {};
    const action = params.action || "status";

    if (action === "sync") return handleSync(params);
    return jsonResponse({ status: "ready" });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ error: "Invalid request" });
    }
    const data = JSON.parse(e.postData.contents);
    return syncReceipt(data);
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

function handleSync(params) {
  if (!params.data) {
    return jsonResponse({ error: "Missing data parameter" });
  }
  const data = JSON.parse(decodeURIComponent(params.data));
  return syncReceipt(data);
}

function syncReceipt(data) {
  if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
    return jsonResponse({ error: "No items provided" });
  }
  if (data.items.length > 100) {
    return jsonResponse({ error: "Too many items (max 100)" });
  }

  const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!SPREADSHEET_ID) {
    return jsonResponse({ error: "SPREADSHEET_ID not set in Script Properties" });
  }
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName("Master_Log") || ss.insertSheet("Master_Log");

  if (sheet.getLastRow() === 0) { sheet.appendRow(HEADERS); }

  let formattedDate = "";
  if (data.date) {
    const d = new Date(data.date + "T12:00:00");
    if (!isNaN(d.getTime())) {
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const yyyy = d.getFullYear();
      formattedDate = mm + "/" + dd + "/" + yyyy;
    }
  }

  const store = sanitize(data.store || "");
  const paymentType = sanitize(data.paymentType || "");
  const rebateNo = sanitize(data.rebateNo || "");
  const rebateDesc = sanitize(data.rebateDesc || "");

  let rowsAdded = 0;
  data.items.forEach(function(item) {
    var row = new Array(TOTAL_COLUMNS).fill("");
    row[0] = formattedDate;
    row[2] = sanitize(item.itemNo || "");
    row[3] = sanitize(item.desc || "");
    row[4] = sanitize(item.qty || "");
    row[5] = sanitize(item.unitPrice || "");
    row[6] = sanitize(item.totalPrice || "");
    row[10] = paymentType;
    row[11] = sanitize(item.category || "");
    row[12] = rebateNo;
    row[13] = rebateDesc;
    row[14] = store;
    sheet.appendRow(row);
    rowsAdded++;
  });

  return jsonResponse({ status: "success", rowsAdded: rowsAdded });
}

function sanitize(str) {
  if (typeof str !== "string") return String(str);
  return str.substring(0, 500);
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
