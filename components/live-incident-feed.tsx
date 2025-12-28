"use client"

import { useState } from "react"
import { useIncidents } from "@/hooks/use-incidents"
import { IncidentCard } from "@/components/incident-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface LiveIncidentFeedProps {
  status?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

export function LiveIncidentFeed({ status, autoRefresh = true, refreshInterval = 5000 }: LiveIncidentFeedProps) {
  const [isLive, setIsLive] = useState(true)
  const { incidents, loading, error, fetchIncidents } = useIncidents(status)

  // Manual refresh control
  const handleRefresh = async () => {
    await fetchIncidents()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Incident Feed</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {incidents.length} incident{incidents.length !== 1 ? "s" : ""} available
            </p>
          </div>
          {isLive && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium">Live</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && incidents.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : incidents.length > 0 ? (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <IncidentCard key={incident.id} {...incident} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No incidents to display</p>
        )}
      </CardContent>
    </Card>
  )
}
