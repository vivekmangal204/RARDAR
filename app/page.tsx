"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Heart, AlertTriangle, ShieldCheck } from "lucide-react"

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-background">
      {/* ================= HERO SECTION ================= */}
      <div className="relative h-[42vh] w-full overflow-hidden flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/images/hero-bg.jpg')` }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-l" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6">
          <div className="flex items-center justify-center gap-4 mb-5">
            <Heart className="w-9 h-9 text-emerald-400 fill-emerald-400" />
            <AlertTriangle className="w-9 h-9 text-red-400" />
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            RADAR
          </h1>

          <p className="mt-3 text-lg font-medium text-emerald-100">
            Rapid And Dead Animal Rescue
          </p>

          <p className="text-sm text-white/80 max-w-xl mx-auto">
            Real-time reporting system for injured & dead animals using Google technologies
          </p>
        </div>
      </div>

      {/* ================= MAIN CARDS ================= */}
      <div className="max-w-6xl mx-auto px-4 -mt-14 relative z-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* ===== Card 1: Injured Animal ===== */}
          <Card
            className="overflow-hidden border-none shadow-2xl hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={() => router.push("/report?type=injured")}
          >
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url('/images/inj.png')` }}
            />
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                <CardTitle>Report Injured Animal</CardTitle>
              </div>
              <CardDescription>Emergency medical assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Instantly report injured or distressed animals with photo and GPS location.
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6">
                REPORT INJURED ANIMAL
              </Button>
            </CardContent>
          </Card>

          {/* ===== Card 2: Dead Animal ===== */}
          <Card
            className="overflow-hidden border-none shadow-2xl hover:scale-[1.02] transition-transform cursor-pointer"
            onClick={() => router.push("/report?type=dead")}
          >
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url('/images/d.png')` }}
            />
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <CardTitle>Report Dead Animal</CardTitle>
              </div>
              <CardDescription>Safe & hygienic removal</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Request professional dead animal removal to maintain public health and safety.
              </p>
              <Button variant="destructive" className="w-full font-bold py-6">
                REPORT DEAD ANIMAL
              </Button>
            </CardContent>
          </Card>

          {/* ===== Card 3: Admin Dashboard ===== */}
          <Card
            className="overflow-hidden border-none shadow-2xl hover:scale-[1.02] transition-transform cursor-pointer md:col-span-2 lg:col-span-1"
            onClick={() => router.push("/admin/login")}
          >
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url('/images/ad.png')` }}
            />
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <CardTitle>Admin Dashboard</CardTitle>
              </div>
              <CardDescription>Dispatch & Command Center</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                Monitor incidents, update status, and manage reports in real time.
              </p>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6"
              >
                ADMIN DASHBOARD
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="text-center text-xs text-muted-foreground pb-6">
        Powered by Firebase, Google Maps API & Gemini AI
      </footer>
    </main>
  )
}
