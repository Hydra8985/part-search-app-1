import { NextResponse } from "next/server";
import partData from "./part_data.json";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const lowerQuery = query.toLowerCase();
  const results = partData.filter((item) => {
    return (
      item["Part Number"]?.toString().toLowerCase().includes(lowerQuery) ||
      item["Category"]?.toString().toLowerCase().includes(lowerQuery)
    );
  });

  return NextResponse.json(results);
}
