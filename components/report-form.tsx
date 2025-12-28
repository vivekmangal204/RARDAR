"use client"

import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Camera, AlertTriangle, Heart, Loader2, Search } from "lucide-react"
import { generateComplaintNo } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
}

/* ---------- BASIC VALIDATION ---------- */
function basicValidation({
  photo,
  description,
  location,
}: {
  photo: string | null
  description: string
  location: LocationData | null
}) {
  if (!photo) return "Please upload a photo"
  if (!photo.startsWith("data:image")) return "Invalid image format"
  if (photo.length < 5000) return "Image is too small or unclear"
  if (!description.trim() || description.length < 5)
    return "Please add a meaningful description"
  if (!location) return "Location not captured properly"

  return null
}

/* ---------- AI VALIDATION (STEP-3) ---------- */
async function validateWithAI({
  photo,
  category,
  description,
}: {
  photo: string
  category: "injured" | "carcass"
  description: string
}) {
  const res = await fetch("/api/ai/validate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageBase64: photo,
      category,
      description,
    }),
  })

  if (!res.ok) {
    return { valid: false, reason: "AI validation failed" }
  }

  return res.json()
}


export function ReportForm() {
  const [step, setStep] = useState<
    "initial" | "location" | "details" | "confirmation"
  >("initial")

  const [category, setCategory] = useState<"injured" | "carcass" | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [manualAddress, setManualAddress] = useState("")
  const [photo, setPhoto] = useState<string | null>(null)
  const [description, setDescription] = useState("")
  const [complaintNo, setComplaintNo] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [aiReview, setAiReview] = useState<any | null>(null)
  const [aiChecked, setAiChecked] = useState(false)

  /* ---------------- GPS ---------------- */
  const handleGetLocation = async () => {
    setLoading(true)
    setError("")
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          })
        }
      )

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      })
    } catch {
      setError("Unable to get your location. Please allow GPS access.")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- PHOTO ---------------- */
const handlePhotoCapture = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0]
  if (!file) return

  const img = new Image()
  img.src = URL.createObjectURL(file)

  img.onload = () => {
    const canvas = document.createElement("canvas")
    const maxWidth = 800
    const scale = maxWidth / img.width

    canvas.width = maxWidth
    canvas.height = img.height * scale

    const ctx = canvas.getContext("2d")!
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6)
    setPhoto(compressedBase64)
  }
}

  /* ---------------- CATEGORY ---------------- */
  const handleCategorySelect = (cat: "injured" | "carcass") => {
    setCategory(cat)
    setStep("location")
  }

  /* ---------------- SUBMIT (STEP-3 FIXED) ---------------- */
const handleSubmitReport = async () => {
  const validationError = basicValidation({
    photo,
    description,
    location,
  })

  if (validationError) {
    setError(validationError)
    return
  }

  setLoading(true)
  setError("")

  const aiResult = await validateWithAI({
    photo: photo!,
    category: category!,
    description,
  })

  setLoading(false)
  setAiChecked(true)
  setAiReview(aiResult)

  // ❌ STOP HERE — DO NOT SUBMIT YET
}
const handleRunAI = async () => {
    const validationError = basicValidation({
      photo,
      description,
      location,
    })

    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError("")

    const result = await validateWithAI({
      photo: photo!,
      category: category!,
      description,
    })

    setAiReview(result)
    setAiChecked(true)
    setLoading(false)
  }

const handleFinalSubmit = async () => {
  setLoading(true)

  const generatedNo = generateComplaintNo()
  setComplaintNo(generatedNo)

  try {
    await addDoc(collection(db, "incidents"), {
      complaintNo: generatedNo,
      type: category,
      status: "pending",
      description,
      address: manualAddress,
      latitude: location!.latitude,
      longitude: location!.longitude,
      accuracy: location!.accuracy,
      photo,
      aiReview, // 🔥 store AI opinion
      createdAt: serverTimestamp(),
    })

    setStep("confirmation")
  } catch {
    setError("Failed to submit report. Please try again.")
  } finally {
    setLoading(false)
  }
}

  /* ================= INITIAL ================= */
  if (step === "initial") {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Report an Animal Incident</CardTitle>
            <CardDescription>
              Help us respond quickly to animals in need
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleCategorySelect("injured")}
              className="p-6 border rounded-lg hover:bg-muted text-left"
            >
              <Heart className="w-6 h-6 text-red-500 mb-2" />
              <h3 className="font-semibold">Injured / Distress</h3>
              <p className="text-sm text-muted-foreground">
                Animal is injured, sick, or in immediate distress
              </p>
            </button>

            <button
              onClick={() => handleCategorySelect("carcass")}
              className="p-6 border rounded-lg hover:bg-muted text-left"
            >
              <AlertTriangle className="w-6 h-6 text-yellow-500 mb-2" />
              <h3 className="font-semibold">Carcass Removal</h3>
              <p className="text-sm text-muted-foreground">
                Dead animal that needs to be removed
              </p>
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Track Your Previous Complaints</CardTitle>
            <CardDescription>
              Already reported an incident? Track its current status here
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center gap-2"
              onClick={() => router.push("/track")}
            >
              <Search className="w-4 h-4" />
              Track Complaint
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  /* ================= LOCATION ================= */
  if (step === "location") {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Capture Location</CardTitle>
            <CardDescription>
              Please allow GPS access and provide address details
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-muted rounded-lg p-8 text-center">
              <MapPin className="mx-auto w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">
                GPS Location will appear here
              </p>
              <Button onClick={handleGetLocation} disabled={loading}>
                {loading ? "Getting Location..." : "Get My Current Location"}
              </Button>

              {location && (
                <p className="text-green-600 text-xs mt-2">
                  Location captured ✔
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">
                Address / Landmark (Required)
              </label>
              <textarea
                rows={3}
                className="w-full border rounded-md p-3 mt-2"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
              />
            </div>

            {category === "injured" && (
              <p className="text-sm text-orange-600">
                ⚠ Reconfirm: The animal appears injured. If the animal is dead,
                please go back and select <b>Carcass Removal</b>.
              </p>
            )}

            <Button
              className="w-full"
              size="lg"
              disabled={!location || !manualAddress.trim()}
              onClick={() => setStep("details")}
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  /* ================= DETAILS ================= */
  if (step === "details") {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
            <CardDescription>
              Upload a photo and provide more information (optional)
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
  <Alert className="bg-yellow-50 border-yellow-300 text-yellow-800">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}


            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />

          {!photo ? (
  <div
    onClick={() => fileInputRef.current?.click()}
    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
  >
    <Camera className="mx-auto mb-2 text-muted-foreground" />
    <p className="text-sm">
      Tap to take photo or select from gallery
    </p>
  </div>
) : (
  <div className="relative">
    {/* IMAGE */}
    <img
      src={photo}
      className="rounded-lg w-full max-h-72 object-contain border"
      alt="Uploaded incident"
    />

    {/* ❌ REMOVE IMAGE BUTTON */}
    <button
      type="button"
      onClick={() => setPhoto(null)}
      className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black"
      aria-label="Remove image"
    >
      ✕
    </button>
  </div>
)}


            <textarea
              rows={4}
              className="w-full border rounded-md p-3"
              placeholder="Describe the situation (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {aiChecked && aiReview && (
              <Alert className={aiReview.valid ? "border-green-500" : "border-red-500"}>
                <AlertDescription>
                  <div className="font-semibold mb-2">AI Review</div>
                  <pre className="text-xs bg-white p-2 rounded">
                    {JSON.stringify(aiReview, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
         {!aiChecked ? (
              <Button onClick={handleRunAI} className="w-full">
                {loading && <Loader2 className="mr-2 animate-spin" />}
                Run AI Validation
              </Button>
            ) : aiReview?.valid ? (
              <Button onClick={handleFinalSubmit} className="w-full bg-green-600">
                Confirm & Submit
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setAiChecked(false)
                  setAiReview(null)
                }}
                className="w-full"
              >
                Fix & Retry
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  /* ================= CONFIRMATION ================= */
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardContent className="space-y-4 text-sm">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-semibold">
              Complaint Submitted Successfully 🎉
            </p>

            <p className="mt-2">
              <b>Your Complaint Number:</b>
            </p>

            <div className="flex items-center justify-between bg-white border rounded-md p-3 mt-1">
              <span className="font-mono text-lg">{complaintNo}</span>

              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  complaintNo &&
                  navigator.clipboard.writeText(complaintNo)
                }
              >
                Copy
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Please save this number to track your complaint status.
            </p>
          </div>

          <Button
            className="w-full mt-4"
            onClick={() => {
              setStep("initial")
              setCategory(null)
              setLocation(null)
              setManualAddress("")
              setPhoto(null)
              setDescription("")
              setComplaintNo(null)
            }}
          >
            Submit Another Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
