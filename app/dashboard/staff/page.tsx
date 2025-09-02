"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserTable } from "@/components/users/user-table"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/types"

export default function StaffPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [staff, setStaff] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStaff = async () => {
      if (!user?.schoolId) return

      try {
        const staffQuery = query(
          collection(db, "users"),
          where("schoolId", "==", user.schoolId),
          where("role", "in", ["librarian", "counselor", "nurse", "admin_assistant", "maintenance", "security"]),
          where("isActive", "==", true),
        )

        const staffSnapshot = await getDocs(staffQuery)
        const staffData = staffSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[]

        setStaff(staffData)
      } catch (error) {
        console.error("Error fetching staff:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStaff()
  }, [user?.schoolId])

  const handleView = (staffMember: User) => {
    router.push(`/dashboard/staff/${staffMember.id}`)
  }

  const handleEdit = (staffMember: User) => {
    router.push(`/dashboard/staff/${staffMember.id}/edit`)
  }

  const handleDelete = async (staffMember: User) => {
    if (confirm(`Are you sure you want to delete ${staffMember.profile.firstName} ${staffMember.profile.lastName}?`)) {
      try {
        await updateDoc(doc(db, "users", staffMember.id), {
          isActive: false,
          updatedAt: new Date(),
        })

        // Remove from local state
        setStaff((prev) => prev.filter((s) => s.id !== staffMember.id))
      } catch (error) {
        console.error("Error deleting staff member:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Staff" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading staff...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Staff" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground">Manage non-teaching staff members</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/import">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Bulk Import
            </Button>
          </Link>
          <Link href="/dashboard/staff/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Staff
            </Button>
          </Link>
        </div>
      </div>

      <UserTable users={staff} userType="staff" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
