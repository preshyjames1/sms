"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserForm } from "@/components/users/user-form"

export default function NewStaffPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (data: any) => {
    if (!user?.schoolId) {
      throw new Error("No school ID found")
    }

    try {
      const staffData = {
        ...data,
        schoolId: user.schoolId,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      await addDoc(collection(db, "users"), staffData)
      router.push("/dashboard/staff")
    } catch (error) {
      console.error("Error creating staff member:", error)
      throw error
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Staff", href: "/dashboard/staff" },
          { title: "New Staff Member" },
        ]}
      />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Staff Member</h1>
          <p className="text-muted-foreground">Create a new staff account</p>
        </div>

        <UserForm userType="staff" onSubmit={handleSubmit} onCancel={() => router.push("/dashboard/staff")} />
      </div>
    </div>
  )
}
