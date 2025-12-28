"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, AlertTriangle, Clock, MapPin, CheckCircle } from "lucide-react"
import { IncidentDetailsModal } from "./incident-details-modal"
import { updateIncidentProgress } from "@/lib/firestore"
import { completeIncident } from "@/lib/firestore"


interface IncidentCardProps {
  id: string
  category: "injured" | "carcass"
  status: "pending" | "dispatched" | "in-progress" | "resolved"
  description: string
  address?: string
  reportedAt?: any
  photo?:string | null
  priority?: "low" | "medium" | "high"
  progress?: {
    teamAssigned: boolean
    teamReached: boolean
    animalSecured: boolean
  }
  latitude?: number
  longitude?: number
  location?: {
    latitude: number
    longitude: number
  }
  onDispatch?: (id:string) => void
}

export function IncidentCard(props: IncidentCardProps) {
  const {
    id,
    category,
    status,
    description,
    address,
    reportedAt,
    priority = "medium",
    progress,
    latitude,
    longitude,
    location,
    photo,
    onDispatch,
  } = props
  
  const [openDetails, setOpenDetails] = useState(false)
  

  // ✅ LOCAL UI STATE (KEY PART)
  const [localProgress, setLocalProgress] = useState(progress)
  
  const lat = latitude ?? location?.latitude
  const lng = longitude ?? location?.longitude
  const hasLocation = typeof lat === "number" && typeof lng === "number"
  
  // 🔁 HANDLE CHECKBOX UPDATE (UI + FIRESTORE)
  const handleProgressChange = (
    field: "teamAssigned" | "teamReached" | "animalSecured",
    value: boolean
  ) => {
    // 1️⃣ UI update instantly
    setLocalProgress((prev) =>
      prev ? { ...prev, [field]: value } : prev
  )
  
  // 2️⃣ Firestore update
  updateIncidentProgress(id, field, value)
}

return (
  <>
          
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-3">
              {category === "injured" ? (
                <Heart className="w-5 h-5 text-green-600 fill-green-600 mt-1" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
              )}

              <div>
                <h3 className="font-semibold">
                  {category === "injured"
                    ? "Injured / Distress"
                    : "Carcass Removal"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {description || "—"}
                </p>
              </div>
            </div>

            <Badge variant="secondary">{status}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          {/* LOCATION */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {hasLocation ? (
              <span>
                {lat!.toFixed(4)}, {lng!.toFixed(4)}
              </span>
            ) : (
              <span>Location unavailable</span>
            )}
          </div>

          {/* TIME */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {reportedAt
                ? new Date(
                  reportedAt.seconds
                  ? reportedAt.seconds * 1000
                  : reportedAt
                ).toLocaleTimeString()
                : "—"}
            </span>
          </div>

          {/* ✅ RESCUE PROGRESS (WITH GREEN SIGNAL) */}
          {status === "dispatched" && localProgress && (
            <div className="mt-3 space-y-2 rounded-md bg-muted p-3">
              <p className="text-sm font-medium">Rescue Progress</p>

              {/* TEAM ASSIGNED */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localProgress.teamAssigned}
                  onChange={(e) =>
                    handleProgressChange("teamAssigned", e.target.checked)
                  }
                  />
                <span
                  className={`flex items-center gap-2 ${
                    localProgress.teamAssigned
                    ? "text-green-600 font-semibold"
                    : "text-muted-foreground"
                  }`}
                  >
                  {localProgress.teamAssigned && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Team Assigned
                </span>
              </label>

              {/* TEAM REACHED */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localProgress.teamReached}
                  onChange={(e) =>
                    handleProgressChange("teamReached", e.target.checked)
                  }
                  />
                <span
                  className={`flex items-center gap-2 ${
                    localProgress.teamReached
                    ? "text-green-600 font-semibold"
                    : "text-muted-foreground"
                  }`}
                >
                  {localProgress.teamReached && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Team Reached Location
                </span>
              </label>

              {/* ANIMAL SECURED */}
              <label className="flex items-center gap-2">
  <input
    type="checkbox"
    checked={localProgress.animalSecured}
    onChange={async (e) => {
      const checked = e.target.checked
      
      // UI instant update
      setLocalProgress((prev) =>
        prev ? { ...prev, animalSecured: checked } : prev
    )
    
    // Firestore progress update
    await updateIncidentProgress(id, "animalSecured", checked)
    
    // 🔥 FINAL STEP: COMPLETE CASE
    if (checked) {
      await completeIncident(id)
      alert("✅ Case Completed Successfully")
    }
  }}
  />

                <span
                  className={`flex items-center gap-2 ${
                    localProgress.animalSecured
                    ? "text-green-600 font-semibold"
                    : "text-muted-foreground"
                  }`}
                  >
                  {localProgress.animalSecured && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Animal Secured
                </span>
              </label>
            </div>
          )}

          {/* PENDING ACTIONS */}
          {status === "pending" && (
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                className="w-1/2 bg-green-600"
                onClick={() => onDispatch?.(id)}
                >
                Dispatch Team
              </Button>

              <Button
                size="sm"
                className="w-1/2"
                variant="outline"
                onClick={() => setOpenDetails(true)}
                >
                Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DETAILS MODAL */}
      <IncidentDetailsModal
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        incident={{
          category,
          status,
          description,
          address,
          latitude: lat,
          longitude: lng,
          reportedAt,
          priority,
          photo,
        }}
      />
    </>
  )
}
          