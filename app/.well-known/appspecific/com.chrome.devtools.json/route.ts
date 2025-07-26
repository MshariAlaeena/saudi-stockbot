import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    {
      message: "Chrome DevTools probe endpoint",
    },
    { status: 200 },
  )
}
