"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firestore"

type AuthState = {
  user: User | null
  role: "admin" | "team" | null
  teamID: string | null
  loading: boolean
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<"admin" | "team" | null>(null)
  const [teamID, setTeamID] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        setRole(null)
        setTeamID(null)
        setLoading(false)
        return
      }

      setUser(firebaseUser)

      const userRef = doc(db, "users", firebaseUser.uid)
      const snap = await getDoc(userRef)

      if (snap.exists()) {
        const data = snap.data()
        setRole(data.role || null)
        setTeamID(data.teamID || null)
      } else {
        setRole(null)
        setTeamID(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, role, teamID, loading }
}
