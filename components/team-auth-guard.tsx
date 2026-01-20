"use client"

import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { db } from "@/lib/firestore"

export default function TeamAuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/team/login")
        return
      }

      const ref = doc(db, "users", user.uid)
      const snap = await getDoc(ref)

      if (!snap.exists() || snap.data()?.role !== "team") {
        router.replace("/team/login")
        return
      }

      setLoading(false)
    })

    return () => unsub()
  }, [router])

  if (loading) return null

  return <>{children}</>
}
