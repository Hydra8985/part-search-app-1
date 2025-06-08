import partData from './part_data.json';

export default function handler(req, res) {
  const { q } = req.query;

  if (!q || q.length < 2) {
    return res.status(200).json([]);
  }

  const lowerQuery = q.toLowerCase();

  const results = partData.filter(item =>
    item["Part Number"]?.toString().toLowerCase().includes(lowerQuery) ||
    item["Category"]?.toString().toLowerCase().includes(lowerQuery)
  );

  res.status(200).json(results);
}
