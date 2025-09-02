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

export default function StudentsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.schoolId) return

      try {
        const studentsQuery = query(
          collection(db, "users"),
          where("schoolId", "==", user.schoolId),
          where("role", "==", "student"),
          where("isActive", "==", true),
        )

        const studentsSnapshot = await getDocs(studentsQuery)
        const studentsData = studentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[]

        setStudents(studentsData)
      } catch (error) {
        console.error("Error fetching students:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [user?.schoolId])

  const handleView = (student: User) => {
    router.push(`/dashboard/students/${student.id}`)
  }

  const handleEdit = (student: User) => {
    router.push(`/dashboard/students/${student.id}/edit`)
  }

  const handleDelete = async (student: User) => {
    if (confirm(`Are you sure you want to delete ${student.profile.firstName} ${student.profile.lastName}?`)) {
      try {
        await updateDoc(doc(db, "users", student.id), {
          isActive: false,
          updatedAt: new Date(),
        })

        // Remove from local state
        setStudents((prev) => prev.filter((s) => s.id !== student.id))
      } catch (error) {
        console.error("Error deleting student:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Students" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading students...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Students" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage your school's students</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/import">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Bulk Import
            </Button>
          </Link>
          <Link href="/dashboard/students/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </Link>
        </div>
      </div>

      <UserTable users={students} userType="students" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
