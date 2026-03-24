import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Forward the payload directly to the n8n webhook
    // This runs server-side (Node.js edge), completely bypassing browser CORS
    const n8nResponse = await fetch("https://n8n.srv1031893.hstgr.cloud/webhook-test/61743c7f-648d-493d-ba76-708860eddd12", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook error: HTTP ${n8nResponse.status}`);
    }

    // Attempt to parse the JSON response from n8n
    const textData = await n8nResponse.text();
    let data;
    try {
      data = textData ? JSON.parse(textData) : {};
    } catch (e) {
      data = textData; // In case n8n returned a raw string instead of JSON
    }

    // Return the result back to the browser
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error("AI Proxy Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch from n8n webhook" },
      { status: 500 }
    );
  }
}
