import { readFile, utils } from 'xlsx';
import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(200).json([]);
  }

  try {
    const filePath = path.join(process.cwd(), 'Launch_Ready_PartSearchApp', 'Finalfixeddracsheet.xlsx');
    const fileBuffer = await fs.readFile(filePath);
    const workbook = readFile(fileBuffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = utils.sheet_to_json(sheet);

    const query = q.toLowerCase();
    const filtered = data.filter(item =>
      item['Part Number']?.toString().toLowerCase().includes(query)
    ).map(item => ({
      part: item['Part Number'],
      category: item['Category'],
      price: item['Price']
    }));

    res.status(200).json(filtered);
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
