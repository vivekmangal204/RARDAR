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
import {
  Heart,
  AlertTriangle,
  ShieldCheck,
  Users,
} from "lucide-react"

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

    {/* ================= HERO ================= */}
    {/* ================= HERO SECTION ================= */}
<section className="relative py-28 px-6 text-center overflow-hidden bg-slate-50">
  {/* Background Banner Image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
  />

  {/* Soft light overlay */}
  <div className="absolute inset-0 bg-white/40" />

  {/* Hero Content */}
  <div className="relative z-10 max-w-3xl mx-auto">
    <div className="flex justify-center gap-4 mb-6">
      <Heart className="w-9 h-9 text-emerald-600 fill-emerald-600" />
      <AlertTriangle className="w-9 h-9 text-red-500" />
    </div>

    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
      RADAR
    </h1>

    <p className="mt-3 text-lg text-emerald-700 font-semibold">
      Rapid And Dead Animal Rescue
    </p>

    <p className="mt-6 text-sm md:text-base text-slate-700 leading-relaxed">
      A centralized, real-time reporting and response platform for injured
      and deceased animals. Designed for faster coordination between
      citizens, rescue teams, and authorities.
    </p>
  </div>

  {/* Bottom fade merge with cards */}
  <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-b from-transparent to-slate-50" />
</section>



      {/* ================= CARDS ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <ActionCard
            title="Report Injured Animal"
            desc="Emergency medical assistance"
            img="/images/inj.png"
            icon={<Heart className="w-5 h-5 text-emerald-600 fill-emerald-600" />}
            buttonText="REPORT INJURED"
            buttonClass="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => router.push("/report?type=injured")}
          />

          <ActionCard
            title="Report Dead Animal"
            desc="Safe & hygienic removal"
            img="/images/d.png"
            icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
            buttonText="REPORT DEAD"
            buttonClass="bg-red-600 hover:bg-red-700"
            onClick={() => router.push("/report?type=dead")}
          />

          <ActionCard
            title="Team Login"
            desc="Rescue team operations dashboard"
            img="/images/team.png"
            icon={<Users className="w-5 h-5 text-yellow-500" />}
            buttonText="TEAM DASHBOARD"
            buttonClass="bg-yellow-500 hover:bg-yellow-600 text-black"
            onClick={() => router.push("/team/login")}
          />

          <ActionCard
            title="Admin Dashboard"
            desc="Command & dispatch center"
            img="/images/ad.png"
            icon={<ShieldCheck className="w-5 h-5 text-blue-600" />}
            buttonText="ADMIN PANEL"
            buttonClass="bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push("/admin/login")}
          />

        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="bg-white border-t py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <TrustItem
            title="Real-Time Response"
            desc="Instant reporting with live incident tracking."
          />
          <TrustItem
            title="Coordinated Teams"
            desc="Admin-to-team task assignment & updates."
          />
          <TrustItem
            title="Reliable Technology"
            desc="Powered by Firebase, Google Maps API & Gemini AI."
          />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center text-xs text-slate-500 py-6">
        © 2026 RADAR · Emergency Animal Rescue Platform
      </footer>
    </main>
  )
}

/* ================= ACTION CARD ================= */

function ActionCard({
  title,
  desc,
  img,
  icon,
  buttonText,
  buttonClass,
  onClick,
}: any) {
  return (
    <Card
      className="bg-white border border-slate-200 rounded-xl overflow-hidden
                 shadow-sm hover:shadow-lg transition-all"
    >
      {/* IMAGE FIX: no blank feel */}
      <div className="h-48 bg-slate-100 flex items-center justify-center">
        <img
          src={img}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-base">
            {title}
          </CardTitle>
        </div>
        <CardDescription className="text-slate-600 text-sm">
          {desc}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          onClick={onClick}
          className={`w-full py-6 font-semibold ${buttonClass}`}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}

/* ================= TRUST ITEM ================= */

function TrustItem({ title, desc }: any) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">
        {title}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed">
        {desc}
      </p>
    </div>
  )
}
