"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserForm } from "@/components/users/user-form"
import type { User } from "@/lib/types"

export default function EditStudentPage() {
  const params = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudent = async () => {
      if (!params.id) return

      try {
        const studentDoc = await getDoc(doc(db, "users", params.id as string))
        if (studentDoc.exists()) {
          setStudent({ id: studentDoc.id, ...studentDoc.data() } as User)
        }
      } catch (error) {
        console.error("Error fetching student:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [params.id])

  const handleSubmit = async (data: any) => {
    if (!student) return

    try {
      await updateDoc(doc(db, "users", student.id), {
        ...data,
        updatedAt: new Date(),
      })
      router.push(`/dashboard/students/${student.id}`)
    } catch (error) {
      console.error("Error updating student:", error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader
          breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Students", href: "/dashboard/students" },
            { title: "Loading..." },
          ]}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading student details...</div>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader
          breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Students", href: "/dashboard/students" },
            { title: "Not Found" },
          ]}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Student not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Students", href: "/dashboard/students" },
          {
            title: `${student.profile.firstName} ${student.profile.lastName}`,
            href: `/dashboard/students/${student.id}`,
          },
          { title: "Edit" },
        ]}
      />

      <UserForm user={student} userType="students" onSubmit={handleSubmit} isLoading={loading} />
    </div>
  )
}
