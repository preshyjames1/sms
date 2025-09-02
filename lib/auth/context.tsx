"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  type User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import type { User } from "@/lib/types"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: Partial<User> & { schoolName?: string }) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser)

      if (firebaseUser) {
        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data() as User
            setUser({
              ...userData,
              id: firebaseUser.uid,
              email: firebaseUser.email || userData.email,
            })
          } else {
            // User document doesn't exist, sign out
            await firebaseSignOut(auth)
            setUser(null)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          setUser(null)
        }
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign in")
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<User> & { schoolName?: string }) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)

      // Update Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: `${userData.profile?.firstName} ${userData.profile?.lastName}`,
      })

      // Create user document in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        role: userData.role || "school_admin",
        schoolId: userData.schoolId || firebaseUser.uid, // For school admins, schoolId is their user ID
        profile: userData.profile!,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }

      await setDoc(doc(db, "users", firebaseUser.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // If this is a school admin, create the school document
      if (userData.role === "school_admin" && userData.schoolId === firebaseUser.uid) {
        const schoolData = {
          id: firebaseUser.uid,
          name: userData.schoolName || `${userData.profile?.firstName}'s School`,
          adminId: firebaseUser.uid,
          email: firebaseUser.email!,
          address: userData.profile?.address || {
            street: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
          },
          phone: userData.profile?.phone || "",
          settings: {
            academicYear: new Date().getFullYear().toString(),
            currency: "USD",
            timezone: "UTC",
            language: "en",
            features: {
              attendance: true,
              examinations: true,
              library: false,
              transport: false,
              hostel: false,
              accounting: false,
              messaging: true,
            },
          },
          subscription: "free",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isActive: true,
        }

        await setDoc(doc(db, "schools", firebaseUser.uid), schoolData)
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to create account")
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setFirebaseUser(null)
      router.push("/auth/login")
    } catch (error: any) {
      console.error("Error signing out:", error)
      throw new Error(error.message || "Failed to sign out")
    }
  }

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) throw new Error("No user logged in")

    try {
      const updatedUser = { ...user, ...data, updatedAt: new Date() }
      await setDoc(
        doc(db, "users", user.id),
        {
          ...updatedUser,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      )

      setUser(updatedUser)
    } catch (error: any) {
      throw new Error(error.message || "Failed to update profile")
    }
  }

  const value = {
    user,
    firebaseUser,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
