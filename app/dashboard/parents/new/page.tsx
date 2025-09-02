"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserForm } from "@/components/users/user-form"

export default function NewParentPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (data: any) => {
    if (!user?.schoolId) {
      throw new Error("No school ID found")
    }

    try {
      const parentData = {
        ...data,
        role: "parent",
        schoolId: user.schoolId,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await addDoc(collection(db, "users"), parentData)
      router.push("/dashboard/parents")
    } catch (error) {
      console.error("Error creating parent:", error)
      throw error
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Parents", href: "/dashboard/parents" },
          { title: "New Parent" },
        ]}
      />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Parent</h1>
          <p className="text-muted-foreground">Create a new parent account</p>
        </div>

        <UserForm userType="parent" onSubmit={handleSubmit} onCancel={() => router.push("/dashboard/parents")} />
      </div>
    </div>
  )
}
