import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const place_id = searchParams.get("place_id");

  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Missing GOOGLE_API_KEY in env" },
      { status: 500 }
    );
  }

  let url = "https://maps.googleapis.com/maps/api/geocode/json?";
  if (lat && lng) {
    url += `latlng=${lat},${lng}`;
  } else if (place_id) {
    url += `place_id=${place_id}`;
  } else {
    return NextResponse.json(
      { error: "Provide lat+lng or place_id" },
      { status: 400 }
    );
  }
  url += `&key=${key}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Geocode error:", err);
    return NextResponse.json(
      { error: "Failed to fetch geocode" },
      { status: 500 }
    );
  }
}
