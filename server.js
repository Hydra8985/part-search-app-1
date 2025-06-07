const express = require('express');
const cors = require('cors');
const xlsx = require('xlsx');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// UPDATED Excel file name
const filePath = path.join(__dirname, 'Finalfixeddracsheet.xlsx');
const workbook = xlsx.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

app.get('/api/search', (req, res) => {
  const q = req.query.q?.toLowerCase() || '';
  const results = data.filter(row =>
    row["Part Number"]?.toString().toLowerCase().includes(q)
  ).map(row => ({
    part: row["Part Number"],
    category: row["Category"],
    price: parseFloat(
      typeof row["Price"] === 'string'
        ? row["Price"].replace(/[^0-9.-]+/g, '')
        : row["Price"]
    ).toFixed(2)
  }));
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
