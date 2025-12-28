import { type NextRequest, NextResponse } from "next/server"

// This would be shared with reports route in production
const incidents: any[] = []

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")

    let filteredIncidents = incidents
    if (status) {
      filteredIncidents = incidents.filter((i) => i.status === status)
    }

    return NextResponse.json(filteredIncidents)
  } catch (error) {
    console.error("Error fetching incidents:", error)
    return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 })
  }
}
