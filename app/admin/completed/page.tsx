"use client"

import { useEffect, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { IncidentCard } from "@/components/incident-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getIncidents, Incident } from "@/lib/firestore"

export default function CompletedPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCompleted() {
      const data = await getIncidents()
      setIncidents(data)
      setLoading(false)
    }
    loadCompleted()
  }, [])

  // ✅ ONLY completed cases
  const completedCases = incidents.filter(
    (incident) => incident.status === "resolved"
  )

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Completed Tasks</h1>
            <p className="text-muted-foreground">
              Successfully resolved incidents
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resolved Cases</CardTitle>
            </CardHeader>

            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : completedCases.length === 0 ? (
                <p className="text-muted-foreground">
                  No completed cases yet
                </p>
              ) : (
                <div className="space-y-4">
                  {completedCases.map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      id={incident.id}
                      category={incident.type}
                      status={incident.status}
                      description={incident.description || "—"}
                      latitude={incident.latitude}
                      longitude={incident.longitude}
                      reportedAt={incident.createdAt}
                      priority={incident.priority}
                      address={incident.address}
                      progress={incident.progress}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
