import { readFile, utils } from "xlsx";
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "Launch_Ready_PartSearchApp", "Finalfixeddracsheet.xlsx");

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = readFile(fileBuffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0]; // Get the first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(worksheet);

    console.log(jsonData.slice(0, 5)); // 👈 This will show a preview in Vercel logs

    const { q } = req.query;
    const filtered = jsonData.filter((item) =>
      String(item["Part Number"]).toLowerCase().includes(String(q || "").toLowerCase())
    );

    res.status(200).json(filtered);
  } catch (error) {
    console.error("Error reading Excel file:", error);
    res.status(500).json({ error: "Failed to load data" });
  }
}
