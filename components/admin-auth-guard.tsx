"use client"

import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth } from "@/lib/firebase"
import { db } from "@/lib/firestore"
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
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/admin/login")
        return
      }

      const ref = doc(db, "users", user.uid)
      const snap = await getDoc(ref)

      if (!snap.exists() || snap.data()?.role !== "admin") {
        router.replace("/admin/login")
        return
      }

      setLoading(false)
    })

    return () => unsub()
  }, [router])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Checking authentication…</p>
      </div>
    )
  }

  return <>{children}</>
}
