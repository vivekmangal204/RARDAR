"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Heart,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle,
} from "lucide-react"
import { IncidentDetailsModal } from "./incident-details-modal"
import { updateIncidentProgress } from "@/lib/firestore"

interface IncidentCardProps {
  id: string
  category: "injured" | "carcass"
  status: "pending" | "dispatched" | "in-progress" | "resolved"
  description: string
  address?: string
  reportedAt?: any
  photo?: string | null
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
  onDispatch?: (id: string) => void
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

  // ✅ SAFE local UI state (admin read-only)
  const [localProgress, setLocalProgress] = useState(progress)

  const lat = latitude ?? location?.latitude
  const lng = longitude ?? location?.longitude
  const hasLocation = typeof lat === "number" && typeof lng === "number"

  // 🔁 Update progress (NO completion here)
  const handleProgressChange = async (
    field: "teamAssigned" | "teamReached" | "animalSecured",
    value: boolean
  ) => {
    setLocalProgress((prev) =>
      prev ? { ...prev, [field]: value } : prev
    )

    await updateIncidentProgress(id, field, value)
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

          {/* PROGRESS VIEW (ADMIN = MONITOR ONLY) */}
          {status === "dispatched" && localProgress && (
            <div className="mt-3 space-y-2 rounded-md bg-muted p-3">
              <p className="text-sm font-medium">Rescue Progress</p>

              {[
                { key: "teamAssigned", label: "Team Assigned" },
                { key: "teamReached", label: "Team Reached Location" },
                { key: "animalSecured", label: "Animal Secured" },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center gap-2 ${
                    (localProgress as any)[item.key]
                      ? "text-green-600 font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {(localProgress as any)[item.key] && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {item.label}
                </div>
              ))}
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
