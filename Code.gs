/**
 * Ledger Lite v9.2 - Apps Script
 * Captures Date in MM/DD/YYYY format.
 */

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Master_Log") || ss.insertSheet("Master_Log");
  
  const headers = [
    "Receipt Date", "", "Item Number", "Description", 
    "Quantity", "Price Per Unit", "Total Price", 
    "", "", "", "Payment Type", "Category", 
    "Rebate Number", "Rebate Description", "Store"
  ];

  if (sheet.getLastRow() === 0) { sheet.appendRow(headers); }

  try {
    const data = JSON.parse(e.postData.contents);
    
    // Force the date into MM/DD/YYYY format
    let formattedDate = "";
    if (data.date) {
      const d = new Date(data.date + "T12:00:00"); // Midday to avoid timezone shifts
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const yyyy = d.getFullYear();
      formattedDate = `${mm}/${dd}/${yyyy}`;
    }

    data.items.forEach(item => {
      let row = new Array(15).fill(""); 
      
      row[0] = formattedDate;    // Col A: MM/DD/YYYY
      row[1] = "";               // Col B: Blank
      row[2] = item.itemNo;      // Col C
      row[3] = item.desc;        // Col D
      row[4] = item.qty;         // Col E
      row[5] = item.unitPrice;   // Col F
      row[6] = item.totalPrice;  // Col G
      row[10] = data.paymentType; // Col K
      row[11] = item.category;    // Col L
      row[12] = data.rebateNo;    // Col M
      row[13] = data.rebateDesc;  // Col N
      row[14] = data.store;       // Col O
      
      sheet.appendRow(row);
    });

    return ContentService.createTextOutput("Success");
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString());
  }
}
