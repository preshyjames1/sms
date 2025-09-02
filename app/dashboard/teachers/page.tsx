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

export default function TeachersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [teachers, setTeachers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeachers = async () => {
      if (!user?.schoolId) return

      try {
        const teachersQuery = query(
          collection(db, "users"),
          where("schoolId", "==", user.schoolId),
          where("role", "==", "teacher"),
          where("isActive", "==", true),
        )

        const teachersSnapshot = await getDocs(teachersQuery)
        const teachersData = teachersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[]

        setTeachers(teachersData)
      } catch (error) {
        console.error("Error fetching teachers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [user?.schoolId])

  const handleView = (teacher: User) => {
    router.push(`/dashboard/teachers/${teacher.id}`)
  }

  const handleEdit = (teacher: User) => {
    router.push(`/dashboard/teachers/${teacher.id}/edit`)
  }

  const handleDelete = async (teacher: User) => {
    if (confirm(`Are you sure you want to delete ${teacher.profile.firstName} ${teacher.profile.lastName}?`)) {
      try {
        await updateDoc(doc(db, "users", teacher.id), {
          isActive: false,
          updatedAt: new Date(),
        })

        // Remove from local state
        setTeachers((prev) => prev.filter((t) => t.id !== teacher.id))
      } catch (error) {
        console.error("Error deleting teacher:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Teachers" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading teachers...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Teachers" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">Manage your school's teaching staff</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/import">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Bulk Import
            </Button>
          </Link>
          <Link href="/dashboard/teachers/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Teacher
            </Button>
          </Link>
        </div>
      </div>

      <UserTable users={teachers} userType="teachers" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
