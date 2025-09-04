"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserForm } from "@/components/users/user-form"
import type { User } from "@/lib/types"

export default function NewStudentPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (userData: Partial<User>) => {
    if (!user?.schoolId) {
      throw new Error("School ID not found")
    }

    setIsLoading(true)
    try {
      const userDoc = {
        ...userData,
        schoolId: user.schoolId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }

      await addDoc(collection(db, "users"), userDoc)
      router.push("/dashboard/students")
    } catch (error) {
      console.error("Error creating student:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Students", href: "/dashboard/students" },
          { title: "Add New Student" },
        ]}
      />

      <UserForm userType="students" onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}
