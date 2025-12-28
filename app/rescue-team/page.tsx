"use client"

import { useState } from "react"
import { RescueTeamInterface } from "@/components/rescue-team-interface"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

const MOCK_TASK = {
  id: "task-001",
  category: "injured" as const,
  location: { latitude: 40.7128, longitude: -74.006 },
  description: "Golden retriever hit by car, bleeding from hind legs",
  reportedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  priority: "high" as const,
}

export default function RescueTeamPage() {
  const [completedTasks, setCompletedTasks] = useState(0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted py-8">
      <div className="w-full max-w-2xl mx-auto p-4">
        {/* Team Info */}
        <Card className="mb-6 bg-sidebar text-sidebar-foreground border-sidebar-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Rescue Team Alpha</CardTitle>
                <p className="text-sm text-sidebar-foreground/60 mt-1">Vehicle: A-12 | Members: 3</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{completedTasks}</p>
                <p className="text-xs text-sidebar-foreground/60">Tasks Completed Today</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Task Assignment */}
        <RescueTeamInterface
          task={MOCK_TASK}
          onAccept={() => console.log("Task accepted")}
          onComplete={() => setCompletedTasks((prev) => prev + 1)}
        />

        {/* Communication Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Dispatch Center</p>
                <p className="text-lg font-semibold">1-800-RAR-DARR</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coordinator on Duty</p>
                <p className="text-lg font-semibold">John Smith</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
