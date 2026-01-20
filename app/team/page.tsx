"use client"

import { useEffect, useState } from "react"
import TeamAuthGuard from "@/components/team-auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, CheckCircle, MapPin } from "lucide-react"

import {
  getAssignedIncident,
  updateIncidentProgress,
  completeIncident,
} from "@/lib/firestore"

import { useAuth } from "@/hooks/use-auth"

type Incident = {
  id: string
  type: string
  description: string
  address?: string
  status: string
}

export default function TeamPage() {
  return (
    <TeamAuthGuard>
      <TeamDashboard />
    </TeamAuthGuard>
  )
}

function TeamDashboard() {
  const { teamID, user, loading: authLoading } = useAuth()
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // wait for auth to finish
      if (authLoading) return

      // no team assigned
      if (!teamID) {
        setIncident(null)
        setLoading(false)
        return
      }

      const data = await getAssignedIncident(teamID)
      setIncident(data)
      setLoading(false)
    }

    load()
  }, [teamID, authLoading])

  if (loading) {
    return <p className="p-8">Loading...</p>
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <h1 className="text-3xl font-bold mb-2">Team Dashboard</h1>
        <p className="text-muted-foreground">
          No incident assigned to your team yet.
        </p>
      </div>
    )
  }

  const sendUpdate = async (
    field: "teamReached" | "animalSecured"
  ) => {
    await updateIncidentProgress(incident.id, field, true)
    alert("Update sent to admin")
  }

  const finishRescue = async () => {
    if (!user?.uid) return

    await completeIncident(incident.id, user?.uid)
    alert("Rescue completed")
    setIncident(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Team Dashboard</h1>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Assigned Incident
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="font-medium capitalize">{incident.type}</p>
            <p className="text-sm text-slate-600">
              {incident.description}
            </p>
            {incident.address && (
              <p className="text-xs text-slate-500 mt-1">
                📍 {incident.address}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => sendUpdate("teamReached")}
            >
              Reached Location
            </Button>

            <Button
              variant="outline"
              onClick={() => sendUpdate("animalSecured")}
            >
              Rescue In Progress
            </Button>
          </div>

          <div className="border-t pt-4 space-y-3">
            <Button variant="secondary" className="w-full" disabled>
              <Camera className="w-4 h-4 mr-2" />
              Upload Rescue Photo (Next)
            </Button>

            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={finishRescue}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Rescue Completed
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
