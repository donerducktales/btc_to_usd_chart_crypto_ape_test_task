export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify("api key missed"), {
        status: 500,
      });
    }

    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=31",
      {
        method: "GET",
        headers: {
          "X-Cg-Api-Key": apiKey,
        },
      }
    );

    if (!res.ok) {
      return new Response(
        JSON.stringify("Failed to fetch data from CoinGecko"),

        { status: res.status }
      );
    }

    const data = await res.json();

    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error("Internal Server Error:", error);
    return new Response(JSON.stringify("server error"), {
      status: 500,
    });
  }
}
