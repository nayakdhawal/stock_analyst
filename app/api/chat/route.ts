import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    const isDev = process.env.NODE_ENV === "development"
    const webhookUrl = process.env.N8N_WEBHOOK_URL

    console.log("[v0] Webhook request started for message:", message)
    console.log("[v0] Environment:", process.env.NODE_ENV)

    if (!webhookUrl) {
      if (isDev) {
        // Fallback for local development if no N8N_WEBHOOK_URL is set
        const devFallback = "https://n8n.srv1031893.hstgr.cloud/webhook-test/61743c7f-648d-493d-ba76-708860eddd12"
        console.warn("[v0] N8N_WEBHOOK_URL not set. Using dev fallback:", devFallback)
        return await handleWebhookCall(devFallback, message)
      }

      console.warn("[v0] N8N_WEBHOOK_URL not set in production. Using default production URL.")
      const prodFallback = "https://n8n.srv1031893.hstgr.cloud/webhook/61743c7f-648d-493d-ba76-708860eddd12"
      return await handleWebhookCall(prodFallback, message)
    }

    return await handleWebhookCall(webhookUrl, message)
  } catch (error: any) {
    console.error("[v0] API Error details:", error.message)
    return NextResponse.json({ error: "Failed to process request", details: error.message }, { status: 500 })
  }
}

async function handleWebhookCall(webhookUrl: string, message: string) {
  try {
    console.log("[v0] Using webhook URL:", webhookUrl)

    // We append the stock name as a query parameter
    const urlWithParams = new URL(webhookUrl)
    urlWithParams.searchParams.append("stock", message)

    const n8nResponse = await fetch(urlWithParams.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    })

    console.log("[v0] Webhook response status:", n8nResponse.status)

    const contentType = n8nResponse.headers.get("content-type")
    const rawText = await n8nResponse.text()
    console.log("[v0] Webhook raw response:", rawText)

    let data: any

    if (!rawText || rawText.trim() === "") {
      console.warn("[v0] Webhook returned an empty response.")
      data = { analysis: "The analysis service returned an empty response. Please try again." }
    } else if (contentType && contentType.includes("application/json")) {
      try {
        data = JSON.parse(rawText)
      } catch (parseError: any) {
        console.error("[v0] Failed to parse JSON response:", parseError.message)
        data = { analysis: rawText }
      }
    } else {
      // If it's not explicitly JSON, wrap the raw text as analysis
      data = { analysis: rawText }
    }

    console.log("[v0] Webhook processed data:", data)

    if (!n8nResponse.ok) {
      if (n8nResponse.status === 500 && data.message?.includes("Unused Respond to Webhook node")) {
        return NextResponse.json(
          {
            error: "n8n Configuration Error",
            details: "Your n8n workflow has an 'Unused Respond to Webhook' node.",
            hint: "In n8n, make sure your 'Respond to Webhook' node is actually connected to the workflow path and is the final node being executed.",
          },
          { status: 500 },
        )
      }

      if (n8nResponse.status === 404 && webhookUrl.includes("/webhook-test/")) {
        return NextResponse.json(
          {
            error: "Webhook Not Active",
            details:
              "Your n8n test webhook is not active. Please click 'Execute Workflow' in n8n and try again, or use a Production Webhook URL.",
            hint: "Test webhooks in n8n only stay active for one request after clicking Execute.",
          },
          { status: 404 },
        )
      }
      throw new Error(`Webhook responded with status: ${n8nResponse.status}`)
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] API Error details:", error.message)
    return NextResponse.json({ error: "Failed to process request", details: error.message }, { status: 500 })
  }
}
