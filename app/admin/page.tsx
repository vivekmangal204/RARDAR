"use client"

import { useEffect, useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { IncidentCard } from "@/components/incident-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Heart, Clock, CheckCircle } from "lucide-react"
import { getIncidents, Incident, dispatchIncident } from "@/lib/firestore"
import { getAverageResponseTime } from "@/lib/analytics"

export default function AdminDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)

  // ✅ RESPONSE TIME STATE
  const [avgResponseTime, setAvgResponseTime] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const data = await getIncidents()
      setIncidents(data)
      setLoading(false)
    }
    load()
  }, [])

  // ✅ LOAD AVG RESPONSE TIME
  useEffect(() => {
    getAverageResponseTime().then(setAvgResponseTime)
  }, [])

  const pending = incidents.filter((i) => i.status === "pending")
  const active = incidents.filter((i) =>
    ["dispatched", "in-progress"].includes(i.status)
  )
  const completed = incidents.filter((i) => i.status === "resolved")

  const handleDispatch = async (id: string) => {
    await dispatchIncident(id)
    const updated = await getIncidents()
    setIncidents(updated)

    // refresh response time after new completion
    const time = await getAverageResponseTime()
    setAvgResponseTime(time)
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Real-time incident monitoring and dispatch
        </p>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Stat
            title="Pending"
            value={pending.length}
            icon={<AlertTriangle className="text-red-500 w-4 h-4" />}
          />

          <Stat
            title="Active"
            value={active.length}
            icon={<Heart className="text-green-600 w-4 h-4" />}
          />

          <Stat
            title="Completed"
            value={completed.length}
            icon={<CheckCircle className="text-green-600 w-4 h-4" />}
          />

          <Stat
            title="Response Time"
            value={
              avgResponseTime === null ? "—" : `${avgResponseTime}m`
            }
            icon={<Clock className="text-blue-600 w-4 h-4" />}
          />
        </div>

        {/* ================= INCIDENT LIST ================= */}
        <Card>
          <CardHeader>
            <CardTitle>New Incidents</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : pending.length === 0 ? (
              <p className="text-muted-foreground">No pending incidents</p>
            ) : (
              <div className="space-y-4">
                {pending.map((incident) => (
                  <IncidentCard
                    key={incident.id}
                    id={incident.id}
                    category={incident.type}
                    status={incident.status}
                    description={incident.description}
                    latitude={incident.latitude}
                    longitude={incident.longitude}
                    reportedAt={incident.createdAt}
                    address={incident.address}
                    photo={incident.photo}
                    onDispatch={() => handleDispatch(incident.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

/* ================= STAT COMPONENT ================= */

function Stat({
  title,
  value,
  icon,
}: {
  title: string
  value: number | string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}
