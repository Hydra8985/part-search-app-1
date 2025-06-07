
import xlsx from "xlsx";
import path from "path";
import { promises as fs } from "fs";

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q || q.length < 2) {
    return res.status(400).json([]);
  }

  const filePath = path.join(process.cwd(), "Launch_Ready_PartSearchApp", "Finalfixeddracsheet.xlsx");
  try {
    const fileBuffer = await fs.readFile(filePath);
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const filtered = data
      .filter((row) =>
        row["Part Number"] &&
        row["Part Number"].toString().toLowerCase().includes(q.toLowerCase())
      )
      .map((row) => ({
        part: row["Part Number"],
        category: row["Category"] || "N/A",
        price: row["Price"] || 0
      }));

    return res.status(200).json(filtered);
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: "Failed to process Excel data" });
  }
}
