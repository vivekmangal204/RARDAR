"use client"

import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const router = useRouter()
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (user) => {
//       if (!user) {
//         router.replace("/admin/login")
//       } else {
//         setLoading(false)
//       }
//     })

//     return () => unsub()
//   }, [router])

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         Checking authentication...
//       </div>
//     )
//   }

//   return <>{children}</>
// }
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
