"use client"

import { useEffect, useState } from "react"
import AdminAuthGuard from "@/components/admin-auth-guard"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { IncidentCard } from "@/components/incident-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Heart, Clock, CheckCircle, Users } from "lucide-react"

import {
  getIncidents,
  Incident,
  dispatchIncident,
  getTeams,
  assignTeamToIncident,
} from "@/lib/firestore"
import { getAverageResponseTime } from "@/lib/analytics"

export default function AdminPage() {
  return (
    <AdminAuthGuard>
      <AdminDashboard />
    </AdminAuthGuard>
  )
}

/* ================= DASHBOARD ================= */

function AdminDashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [avgResponseTime, setAvgResponseTime] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const incidentData = await getIncidents()
      const teamData = await getTeams()

      setIncidents(incidentData)
      setTeams(teamData)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    getAverageResponseTime().then(setAvgResponseTime)
  }, [])

  const pending = incidents.filter((i) => i.status === "pending")
  const active = incidents.filter((i) =>
    ["dispatched", "in-progress"].includes(i.status)
  )
  const completed = incidents.filter((i) => i.status === "resolved")

  const freeTeams = teams.filter((t) => t.available)
  const busyTeams = teams.filter((t) => !t.available)

  const handleAssign = async (incidentId: string) => {
    if (freeTeams.length === 0) {
      alert("No free teams available")
      return
    }

    const team = freeTeams[0] // auto-pick first free team

    await assignTeamToIncident(
      incidentId,
      team.teamID,
      team.uid
    )

    const updatedIncidents = await getIncidents()
    const updatedTeams = await getTeams()

    setIncidents(updatedIncidents)
    setTeams(updatedTeams)
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
            title="Free Teams"
            value={freeTeams.length}
            icon={<Users className="text-blue-600 w-4 h-4" />}
          />
          <Stat
            title="Busy Teams"
            value={busyTeams.length}
            icon={<Clock className="text-orange-500 w-4 h-4" />}
          />
        </div>

        {/* ================= INCIDENT LIST ================= */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Incidents</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : pending.length === 0 ? (
              <p className="text-muted-foreground">No pending incidents</p>
            ) : (
              <div className="space-y-4">
                {pending.map((incident) => (
                  <div key={incident.id} className="space-y-2">
                    <IncidentCard
                      id={incident.id}
                      category={incident.type}
                      status={incident.status}
                      description={incident.description}
                      latitude={incident.latitude}
                      longitude={incident.longitude}
                      reportedAt={incident.createdAt}
                      address={incident.address}
                      photo={incident.photo}
                    />

                    {/* ASSIGN TEAM BUTTON */}
                    <button
                      onClick={() => handleAssign(incident.id)}
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                      Assign {freeTeams[0]?.teamID ?? ""}
                    </button>
                  </div>
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
