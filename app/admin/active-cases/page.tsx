"use client"

import { useEffect, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { IncidentCard } from "@/components/incident-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getIncidents, Incident } from "@/lib/firestore"
import { dispatchIncident } from "@/lib/firestore"

export default function ActiveCasesPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadIncidents() {
      try {
        const data = await getIncidents()
        setIncidents(data)
      } catch (error) {
        console.error("Failed to load incidents", error)
      } finally {
        setLoading(false)
      }
    }

    loadIncidents()
  }, [])

  // ✅ ACTIVE = dispatched only
  const activeCases = incidents.filter(
    (incident) => incident.status === "dispatched"
  )

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Active Cases</h1>
            <p className="text-muted-foreground">
              Incidents currently being handled by rescue teams
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>In-Progress Rescues</CardTitle>
            </CardHeader>

            <CardContent>
              {loading ? (
                <p>Loading...</p>
              ) : activeCases.length === 0 ? (
                <p className="text-muted-foreground">No active cases</p>
              ) : (
                <div className="space-y-4">
                  {activeCases.map((incident) => (
                    <IncidentCard
                      key={incident.id}
                      id={incident.id}
                      category={incident.type}
                      status={incident.status}
                      description={incident.description || "—"}
                      latitude={incident.latitude}
                      longitude={incident.longitude}
                      reportedAt={incident.createdAt}
                      priority={incident.priority ?? "medium"}
                      address={incident.address}
                      progress={incident.progress}
                      onDispatch={async (id) => {
                        await dispatchIncident(id)
                      }}
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
