import prisma from "../db.server";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  console.log("[API_WHATSAPP] Incoming Request URL:", request.url);
  console.log("[API_WHATSAPP] Extracted Shop:", shop);

  if (!shop) {
    console.log("[API_WHATSAPP] Missing shop parameter");
    return new Response(JSON.stringify({ error: "Missing shop parameter" }), { 
      status: 400,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      } 
    });
  }

  try {
    const config = await prisma.widgetConfig.findUnique({
      where: { shop },
    });

    console.log("[API_WHATSAPP] DB Config Result:", config);

    if (!config) {
      return new Response(JSON.stringify({ error: "Configuration not found" }), { 
        status: 404,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        } 
      });
    }

    let parsedChannels = [];
    try {
      if (config.channels) {
        parsedChannels = JSON.parse(config.channels);
      }
    } catch(e) {
      console.error("[API_WHATSAPP] Error parsing channels", e);
    }

    const payload = {
      ...config,
      channels: parsedChannels
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { 
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      } 
    });
  }
}

export async function action({ request }: { request: Request }) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  return new Response(JSON.stringify({ message: "Method not allowed" }), { 
    status: 405,
    headers: { "Content-Type": "application/json" }
  });
}
