"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Camera, MapPin, AlertTriangle, Heart, Clock, Loader2 } from "lucide-react"

interface TaskAssignment {
  id: string
  category: "injured" | "carcass"
  location: { latitude: number; longitude: number }
  description: string
  reportedAt: string
  priority: "low" | "medium" | "high"
}

interface RescueTeamInterfaceProps {
  task: TaskAssignment
  onAccept?: () => void
  onComplete?: () => void
}

export function RescueTeamInterface({ task, onAccept, onComplete }: RescueTeamInterfaceProps) {
  const [status, setStatus] = useState<"waiting" | "accepted" | "in-progress" | "completing" | "completed">("waiting")
  const [proofPhoto, setProofPhoto] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAcceptTask = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/incidents/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "dispatched" }),
      })

      if (response.ok) {
        setStatus("accepted")
        onAccept?.()
      }
    } catch (error) {
      console.error("Failed to accept task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProofPhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProofPhoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCompleteTask = async () => {
    if (!proofPhoto) {
      alert("Please provide proof of action photo before closing the case")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/incidents/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "resolved",
          completionProof: proofPhoto,
          completionNotes: notes,
          completedAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setStatus("completed")
        onComplete?.()
      }
    } catch (error) {
      console.error("Failed to complete task:", error)
    } finally {
      setLoading(false)
    }
  }

  // Waiting for assignment
  if (status === "waiting") {
    return (
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>New Task Assignment</CardTitle>
              <CardDescription>Rescue team dispatch request</CardDescription>
            </div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              A rescue team is needed for this incident. Please review details and accept if available.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              {task.category === "injured" ? (
                <Heart className="w-6 h-6 text-primary fill-primary flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-accent fill-accent flex-shrink-0" />
              )}
              <div>
                <p className="font-semibold">{task.category === "injured" ? "Injured/Distress" : "Carcass Removal"}</p>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-medium">Location</span>
                </div>
                <p className="text-sm font-mono">
                  {task.location.latitude.toFixed(4)}, {task.location.longitude.toFixed(4)}
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">Reported</span>
                </div>
                <p className="text-sm">{new Date(task.reportedAt).toLocaleTimeString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Priority:</span>
              <Badge
                variant="outline"
                className={
                  task.priority === "high"
                    ? "bg-red-100 text-red-800 border-red-300"
                    : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                      : "bg-blue-100 text-blue-800 border-blue-300"
                }
              >
                {task.priority.toUpperCase()}
              </Badge>
            </div>
          </div>

          <Button
            onClick={handleAcceptTask}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Accepting..." : "Accept Task & Dispatch"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Accepted - En route
  if (status === "accepted") {
    return (
      <Card className="border-2 border-blue-300">
        <CardHeader className="bg-blue-50 dark:bg-blue-950">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-blue-900 dark:text-blue-100">Task Accepted - En Route</CardTitle>
              <CardDescription className="text-blue-800 dark:text-blue-200">
                Team dispatched to location
              </CardDescription>
            </div>
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              {task.category === "injured" ? (
                <Heart className="w-6 h-6 text-primary fill-primary flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-accent fill-accent flex-shrink-0" />
              )}
              <div>
                <p className="font-semibold">{task.category === "injured" ? "Injured/Distress" : "Carcass Removal"}</p>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-medium">Navigate to Location</span>
              </div>
              <p className="text-sm font-mono mb-3">
                {task.location.latitude.toFixed(4)}, {task.location.longitude.toFixed(4)}
              </p>
              <Button variant="outline" className="w-full text-sm bg-transparent">
                Open in Maps
              </Button>
            </div>
          </div>

          <Button onClick={() => setStatus("in-progress")} className="w-full bg-primary hover:bg-primary/90" size="lg">
            Mark as In Progress
          </Button>
        </CardContent>
      </Card>
    )
  }

  // In progress
  if (status === "in-progress") {
    return (
      <Card className="border-2 border-purple-300">
        <CardHeader className="bg-purple-50 dark:bg-purple-950">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-purple-900 dark:text-purple-100">Rescue in Progress</CardTitle>
              <CardDescription className="text-purple-800 dark:text-purple-200">
                Team actively working on incident
              </CardDescription>
            </div>
            <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <Alert>
            <Heart className="h-4 w-4" />
            <AlertDescription>Please capture proof of action when the rescue is complete.</AlertDescription>
          </Alert>

          <div className="space-y-4">
            <label className="block text-sm font-medium">Proof of Action Photo</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleProofPhotoCapture}
              className="hidden"
            />

            {proofPhoto ? (
              <div className="relative rounded-lg overflow-hidden border-2 border-green-300">
                <img
                  src={proofPhoto || "/placeholder.svg"}
                  alt="Proof of action"
                  className="w-full h-64 object-cover"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 bg-background/90"
                  onClick={() => setProofPhoto(null)}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center hover:bg-muted transition-colors"
              >
                <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">Take proof photo</span>
                <span className="text-xs text-muted-foreground mt-1">After completing the rescue</span>
              </button>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Completion Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Document any important details about the rescue, animal condition, actions taken, etc."
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>
          </div>

          <Button
            onClick={handleCompleteTask}
            disabled={loading || !proofPhoto}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? "Submitting..." : "Close Case"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Completed
  if (status === "completed") {
    return (
      <Card className="border-2 border-green-300">
        <CardHeader className="bg-green-50 dark:bg-green-950">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
            <div>
              <CardTitle className="text-green-900 dark:text-green-100">Case Closed - Resolved</CardTitle>
              <CardDescription className="text-green-800 dark:text-green-200">
                Rescue operation completed successfully
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <Alert className="bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Thank you for your excellent work. The incident has been successfully resolved and logged.
            </AlertDescription>
          </Alert>

          {proofPhoto && (
            <div>
              <p className="text-sm font-medium mb-2">Proof of Action</p>
              <img
                src={proofPhoto || "/placeholder.svg"}
                alt="Proof of action"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <Button className="w-full" size="lg" onClick={() => setStatus("waiting")}>
            Ready for Next Task
          </Button>
        </CardContent>
      </Card>
    )
  }
}
