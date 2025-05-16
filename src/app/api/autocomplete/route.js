import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("input");

  if (!input) {
    return NextResponse.json({ error: "Missing input query" }, { status: 400 });
  }

  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Missing GOOGLE_API_KEY in env" },
      { status: 500 }
    );
  }

  const url =
    "https://maps.googleapis.com/maps/api/place/autocomplete/json" +
    `?input=${encodeURIComponent(input)}` +
    `&key=${key}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Autocomplete error:", err);
    return NextResponse.json(
      { error: "Failed to fetch autocomplete" },
      { status: 500 }
    );
  }
}
