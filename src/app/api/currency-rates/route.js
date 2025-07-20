// app/api/currency-rates/route.js
export async function GET() {
  try {
    const response = await fetch(
      "https://api.exchangerate.host/latest?base=USD"
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: true,
          message: "Failed to fetch exchange rates",
        }),
        { status: 500 }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify({ rates: data.rates }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: true,
        message: "Internal Server Error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
