"use client"

import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firestore"


export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

const handleLogin = async () => {
  
  setError("")
  setLoading(true)

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const user = cred.user

    const ref = doc(db, "users", user.uid)
    const snap = await getDoc(ref)

    console.log("UID:", user.uid)
    console.log("User doc exists:", snap.exists())
    console.log("User data:", snap.data())

    if (!snap.exists()) {
      setError("User role not configured")
      return
    }

    const role = snap.data()?.role

    if (role === "team") {
      router.replace("/team")
    } else if (role === "admin") {
      router.replace("/admin")
    } else {
      setError("Invalid role assigned")
    }

  } catch (err) {
    console.error(err)
    setError("Invalid email or password")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 space-y-5">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Team Login</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to access dashboard
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="admin@example.com"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-md bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-xs text-center text-gray-400">
          RAR-DAR • Team Access Only
        </p>
      </div>
    </div>
  )
}
