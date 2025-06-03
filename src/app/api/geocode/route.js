// import { NextResponse } from "next/server";

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const lat = searchParams.get("lat");
//   const lng = searchParams.get("lng");
//   const place_id = searchParams.get("place_id");

//   const key = process.env.GOOGLE_API_KEY;
//   if (!key) {
//     return NextResponse.json(
//       { error: "Missing GOOGLE_API_KEY in env" },
//       { status: 500 }
//     );
//   }

//   let url = "https://maps.googleapis.com/maps/api/geocode/json?";
//   if (lat && lng) {
//     url += `latlng=${lat},${lng}`;
//   } else if (place_id) {
//     url += `place_id=${place_id}`;
//   } else {
//     return NextResponse.json(
//       { error: "Provide lat+lng or place_id" },
//       { status: 400 }
//     );
//   }
//   url += `&key=${key}`;

//   try {
//     const res = await fetch(url);
//     const data = await res.json();
//     const addressComponents = data?.results?.[0]?.address_components || [];

//     return NextResponse.json(data);
//   } catch (err) {
//     console.error("Geocode error:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch geocode" },
//       { status: 500 }
//     );
//   }
// }

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

    if (!data.results || !data.results.length) {
      return NextResponse.json({ error: "No address found" }, { status: 404 });
    }

    const components = data.results[0].address_components;

    const getComponent = (type) => {
      const comp = components.find((c) => c.types.includes(type));
      return comp ? comp.long_name : "";
    };

    const structuredAddress = {
      address_line_1:
        getComponent("premise") ||
        getComponent("sublocality") ||
        getComponent("route"),
      landmark:
        getComponent("point_of_interest") || getComponent("establishment"),
      city:
        getComponent("locality") ||
        getComponent("postal_town") ||
        getComponent("administrative_area_level_2"),
      state: getComponent("administrative_area_level_1"),
      pincode: getComponent("postal_code"),
      country: getComponent("country"),
    };

    return NextResponse.json({ address: structuredAddress });
  } catch (err) {
    console.error("Geocode error:", err);
    return NextResponse.json(
      { error: "Failed to fetch geocode" },
      { status: 500 }
    );
  }
}
