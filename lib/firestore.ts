import { initializeApp, getApps, getApp } from "firebase/app"
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  where,
  limit,
  serverTimestamp,
} from "firebase/firestore"
// import {db} from "./firestore"

/* ---------- FIREBASE INIT ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyAu9U2xzllanIkZdU8LMqorQM7isW8yfS4",
  authDomain: "radar-ce4c7.firebaseapp.com",
  projectId: "radar-ce4c7",
  storageBucket: "radar-ce4c7.firebasestorage.app",
  messagingSenderId: "784012162620",
  appId: "1:784012162620:web:bc99e0248a4e16bcc63539",
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
export const db = getFirestore(app)

/* ---------- TYPES ---------- */
export interface Incident {
  id: string
  type: "injured" | "carcass"
  status: "pending" | "dispatched" | "in-progress" | "resolved"
  description: string
  latitude: number
  longitude: number
  address?: string
  photo?:string|null
  createdAt: any
  priority?: "low" | "medium" | "high"
  progress?: {
    teamAssigned: boolean
    teamReached: boolean
    animalSecured: boolean
  }
}

/* ---------- FETCH INCIDENTS ---------- */
export async function getTeams() {
  const q = query(
    collection(db, "users"),
    where("role", "==", "team")
  )

  const snap = await getDocs(q)

  return snap.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }))
}
export async function assignTeamToIncident(
  incidentId: string,
  teamId: string,
  teamUid: string
) {
  // assign incident to team
  await updateDoc(doc(db, "incidents", incidentId), {
    assignedTo: teamId,
    status: "dispatched",
    progress: {
      teamAssigned: true,
      teamReached: false,
      animalSecured: false,
    },
  })

  // mark team busy
  await updateDoc(doc(db, "users", teamUid), {
    available: false,
  })
}

export async function getIncidents(): Promise<Incident[]> {
  const q = query(
    collection(db, "incidents"),
    orderBy("createdAt", "desc")
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => {
    const data = doc.data()

    return {
      id: doc.id,
      type: data.type,
      status: data.status,
      description: data.description || "",
      address: data.address || "",
      latitude: data.latitude,
      longitude: data.longitude,
      createdAt: data.createdAt,
      priority: data.priority || "medium",
      photo: data.photo || null,
      progress: data.progress || {
        teamAssigned: false,
        teamReached: false,
        animalSecured: false,
      },
    }
  })
}
export async function getAssignedIncident() {
  const q = query(
    collection(db, "incidents"),
    where("assignedTo", "==", "teamID"),
    where("status", "in", ["dispatched", "in-progress"]),
    limit(1)
  )

  const snap = await getDocs(q)

  if (snap.empty) return null

  const docSnap = snap.docs[0]

  return {
    id: docSnap.id,
    ...(docSnap.data() as any),
  }
}

export async function updateIncidentStatus(
  id: string,
  status: string
) {
  await updateDoc(doc(db, "incidents", id), {
    status,
    updatedAt: serverTimestamp(),
  })
}



/* ---------- DISPATCH INCIDENT ---------- */
export async function dispatchIncident(id: string) {
  const ref = doc(db, "incidents", id)

  await updateDoc(ref, {
    status: "dispatched",
    progress: {
      teamAssigned: true,
      teamReached: false,
      animalSecured: false,
    },
  })
}


export async function updateIncidentProgress(
  id: string,
  field: "teamAssigned" | "teamReached" | "animalSecured",
  value: boolean
) {
  const ref = doc(db, "incidents", id)

  await updateDoc(ref, {
    [`progress.${field}`]: value,
  })
}


export async function completeIncident(id: string) {
  const ref = doc(db, "incidents", id)

  await updateDoc(ref, {
    status: "resolved",
    completedAt: new Date(),
  })
}

