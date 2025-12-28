import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAu9U2xzllanIkZdU8LMqorQM7isW8yfS4",
  authDomain: "radar-ce4c7.firebaseapp.com",
  projectId: "radar-ce4c7",
  storageBucket: "radar-ce4c7.firebasestorage.app",
  messagingSenderId: "784012162620",
  appId: "1:784012162620:web:bc99e0248a4e16bcc63539",
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()


export const auth = getAuth(app)
export const db = getFirestore(app)
export default app