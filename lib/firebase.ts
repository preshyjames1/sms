import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"
import { getFunctions, type Functions } from "firebase/functions"

const firebaseConfig = {
  apiKey: "AIzaSyBS1AgOBg8A8pBrzeyGHWtCmXXwta1xtQA",
  authDomain: "schoolmanagementsystem2-bd70a.firebaseapp.com",
  projectId: "schoolmanagementsystem2-bd70a",
  storageBucket: "schoolmanagementsystem2-bd70a.firebasestorage.app",
  messagingSenderId: "807582219930",
  appId: "1:807582219930:web:c46894994c9b477167e923",
  measurementId: "G-V9MYD6MSPT",
}

// Initialize Firebase
let app: FirebaseApp
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApps()[0]
}

// Initialize Firebase services
export const auth: Auth = getAuth(app)
export const db: Firestore = getFirestore(app)
export const storage: FirebaseStorage = getStorage(app)
export const functions: Functions = getFunctions(app)

export default app
