import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firestore"

export async function getAverageResponseTime() {
  const q = query(
    collection(db, "incidents"),
    where("status", "==", "resolved")
  )

  const snap = await getDocs(q)

  if (snap.empty) return 0

  let totalTime = 0
  let count = 0

  snap.docs.forEach((doc) => {
    const data = doc.data()

    if (data.createdAt && data.completedAt) {
      const created =
        data.createdAt.seconds
          ? data.createdAt.seconds * 1000
          : new Date(data.createdAt).getTime()

      const completed =
        data.completedAt.seconds
          ? data.completedAt.seconds * 1000
          : new Date(data.completedAt).getTime()

      totalTime += completed - created
      count++
    }
  })

  // return minutes
  return Math.round(totalTime / count / 60000)
}
