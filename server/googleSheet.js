const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "server/google-credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "1nTiMH5_UpfZ8vKad7AvHW4LFqtBq84Lix4IQ8dCK9Q8";

async function addResultRow(row) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A:I",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row]
    }
  });
}

module.exports = { addResultRow };
