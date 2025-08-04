import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    {
      name: "Saudi StockBot",
      version: "1.0.0",
      description: "AI-powered Saudi stock market analysis platform",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    },
  )
}
