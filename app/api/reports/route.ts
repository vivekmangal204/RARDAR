import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In production, this would connect to Firebase Firestore or a SQL database
const reports: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.category || !body.location || !body.location.latitude || !body.location.longitude) {
      return NextResponse.json({ error: "Missing required fields: category, location" }, { status: 400 })
    }

    // Create incident object with initial status
    const incident = {
      id: `incident-${Date.now()}`,
      category: body.category,
      location: body.location,
      description: body.description || "",
      photo: body.photo || null,
      timestamp: body.timestamp || new Date().toISOString(),
      status: "pending",
      priority: determinePriority(body.category, body.description),
      reportedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    // Store the incident
    reports.push(incident)

    // In production: send real-time notification to admin dashboard
    // In production: call AI API (Gemini) to auto-categorize/analyze image
    console.log("[RAR-DAR] New incident reported:", incident.id)

    return NextResponse.json(incident, { status: 201 })
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Optional: filter by status
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")

    let filteredReports = reports
    if (status) {
      filteredReports = reports.filter((r) => r.status === status)
    }

    return NextResponse.json(filteredReports)
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

// Helper function to determine priority
function determinePriority(category: string, description: string): "low" | "medium" | "high" {
  if (category === "injured") {
    const urgentKeywords = ["bleeding", "hit", "attacked", "collision", "emergency"]
    const descLower = description.toLowerCase()

    if (urgentKeywords.some((keyword) => descLower.includes(keyword))) {
      return "high"
    }
    return "medium"
  }

  // Carcass removal is generally lower priority unless on roadway
  const highPriorityKeywords = ["highway", "road", "lane", "traffic", "intersection"]
  const descLower = description.toLowerCase()

  if (highPriorityKeywords.some((keyword) => descLower.includes(keyword))) {
    return "high"
  }

  return "low"
}
