"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"

interface IncidentDetailsModalProps {
  open: boolean
  onClose: () => void
  incident: {
    category: "injured" | "carcass"
    status: string
    description?: string
    address?: string
    latitude?: number
    longitude?: number
    reportedAt?: any
    priority?: string
    photo?:string | null
  }
}

export function IncidentDetailsModal({
  open,
  onClose,
  incident,
}: IncidentDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Incident Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div>
            <b>Category:</b>{" "}
            {incident.category === "injured"
              ? "Injured / Distress"
              : "Carcass Removal"}
          </div>

          <div>
            <b>Status:</b>{" "}
            <Badge variant="secondary">{incident.status}</Badge>
          </div>

          {incident.description && (
            <div>
              <b>Description:</b>
              <p className="text-muted-foreground mt-1">
                {incident.description}
              </p>
            </div>
          )}

          {incident.address && (
            <div>
              <b>Address / Landmark:</b>
              <p className="text-muted-foreground mt-1">
                {incident.address}
              </p>
            </div>
          )}

          {incident.latitude !== undefined &&
            incident.longitude !== undefined && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {incident.latitude.toFixed(4)},{" "}
                  {incident.longitude.toFixed(4)}
                </span>
              </div>
            )}

          {incident.reportedAt && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(
                  incident.reportedAt.seconds
                    ? incident.reportedAt.seconds * 1000
                    : incident.reportedAt
                ).toLocaleString()}
              </span>
            </div>
          )}
          {incident.photo && incident.photo.startsWith("data:image") && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Reported Image</p>
              <img
                src={incident.photo}
                alt="Incident"
                loading="lazy"
                className="w-full max-h-64 object-contain rounded-md border"
              />
            </div>
          )}


        </div>
      </DialogContent>
    </Dialog>
  )
}
