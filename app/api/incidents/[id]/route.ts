import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production would use Firestore/database
const incidents = new Map<string, any>()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const incident = incidents.get(params.id)

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 })
    }

    return NextResponse.json(incident)
  } catch (error) {
    console.error("Error fetching incident:", error)
    return NextResponse.json({ error: "Failed to fetch incident" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // In production, fetch from database
    let incident = incidents.get(params.id)

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 })
    }

    // Update incident with new data
    incident = {
      ...incident,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    // Save back to database
    incidents.set(params.id, incident)

    // In production: trigger real-time update via WebSocket
    console.log("[RAR-DAR] Incident updated:", params.id, "Status:", body.status)

    return NextResponse.json(incident)
  } catch (error) {
    console.error("Error updating incident:", error)
    return NextResponse.json({ error: "Failed to update incident" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!incidents.has(params.id)) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 })
    }

    incidents.delete(params.id)

    return NextResponse.json({ message: "Incident deleted" })
  } catch (error) {
    console.error("Error deleting incident:", error)
    return NextResponse.json({ error: "Failed to delete incident" }, { status: 500 })
  }
}
