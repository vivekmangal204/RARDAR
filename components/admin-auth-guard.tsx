"use client"

import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/admin/login")
      } else {
        setLoading(false)
      }
    })

    // 🛑 SAFETY FALLBACK (MOST IMPORTANT)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => {
      unsub()
      clearTimeout(timer)
    }
  }, [router])

  // ✅ NEVER return null in production
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Checking authentication…</p>
      </div>
    )
  }

  return <>{children}</>
}
