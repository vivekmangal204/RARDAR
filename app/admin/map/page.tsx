"use client"

import { useEffect, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getIncidents, Incident } from "@/lib/firestore"
import { IncidentMap } from "@/components/incident-map"

export default function MapViewPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    getIncidents().then(setIncidents)
  }, [])

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Map View</h1>
            <p className="text-muted-foreground">
              Real-time incident and team locations
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Incident Map</CardTitle>
            </CardHeader>
            <CardContent>
              {/* 👇 MAP INSIDE THE BOX */}
              <div className="rounded-lg h-96 overflow-hidden">
                <IncidentMap incidents={incidents} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
