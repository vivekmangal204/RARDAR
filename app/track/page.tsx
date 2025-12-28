"use client"

import { useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, MapPin, Search } from "lucide-react"

export default function TrackPage() {
  const [complaintNo, setComplaintNo] = useState("")
  const [incident, setIncident] = useState<any>(null)
  const [error, setError] = useState("")

  const handleTrack = async () => {
    setError("")
    setIncident(null)

    const q = query(
      collection(db, "incidents"),
      where("complaintNo", "==", complaintNo)
    )

    const snap = await getDocs(q)

    if (snap.empty) {
      setError("No complaint found")
      return
    }

    setIncident(snap.docs[0].data())
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Track Your Complaint
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* INPUT */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Complaint Number
            </label>
            <input
              className="w-full border rounded-md p-2"
              placeholder="e.g. RAD-2025-AB12"
              value={complaintNo}
              onChange={(e) => setComplaintNo(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <Button
            className="w-full flex items-center gap-2"
            onClick={handleTrack}
          >
            <Search className="w-4 h-4" />
            Track Complaint
          </Button>

          {/* ERROR */}
          {error && (
            <p className="text-red-600 text-sm text-center">
              {error}
            </p>
          )}

          {/* RESULT */}
          {incident && (
            <div className="mt-4 space-y-4 border-t pt-4">
              {/* STATUS */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="secondary" className="mt-1">
                    {incident.status}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">
                    {incident.type === "injured"
                      ? "Injured / Distress"
                      : "Carcass Removal"}
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}
              {incident.description && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Description
                  </p>
                  <p className="text-sm">
                    {incident.description}
                  </p>
                </div>
              )}

              {/* PROGRESS */}
              {incident.progress && (
                <div className="bg-muted rounded-md p-4 space-y-2">
                  <p className="font-medium text-sm mb-2">
                    Rescue Progress
                  </p>

                  <ProgressItem
                    label="Team Assigned"
                    done={incident.progress.teamAssigned}
                  />
                  <ProgressItem
                    label="Team Reached Location"
                    done={incident.progress.teamReached}
                  />
                  <ProgressItem
                    label="Animal Secured"
                    done={incident.progress.animalSecured}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* ---------- SMALL HELPER COMPONENT ---------- */
function ProgressItem({
  label,
  done,
}: {
  label: string
  done: boolean
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {done ? (
        <CheckCircle className="w-4 h-4 text-green-600" />
      ) : (
        <span className="w-4 h-4 rounded-full border border-muted-foreground" />
      )}
      <span className={done ? "text-green-600 font-medium" : ""}>
        {label}
      </span>
    </div>
  )
}
