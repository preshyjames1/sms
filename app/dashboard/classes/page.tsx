"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClassCard } from "@/components/academic/class-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"
import type { Class } from "@/lib/types/academic"
import Link from "next/link"

export default function ClassesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [classes, setClasses] = useState<Class[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.schoolId) return

      try {
        // Fetch classes
        const classesQuery = query(
          collection(db, "classes"),
          where("schoolId", "==", user.schoolId),
          where("isActive", "==", true),
        )
        const classesSnapshot = await getDocs(classesQuery)
        const classesData = classesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Class[]
        setClasses(classesData)

        // Fetch teachers for class teacher names
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
        }))
        setTeachers(teachersData)

        // Fetch students for student counts
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
        }))
        setStudents(studentsData)
      } catch (error) {
        console.error("Error fetching classes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.schoolId])

  const filteredClasses = classes.filter(
    (classData) =>
      classData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classData.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classData.grade.includes(searchTerm),
  )

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId)
    return teacher ? `${teacher.profile?.firstName} ${teacher.profile?.lastName}` : "No Teacher Assigned"
  }

  const getStudentCount = (classId: string) => {
    return students.filter((s) => s.profile?.classId === classId).length
  }

  const handleView = (classData: Class) => {
    router.push(`/dashboard/classes/${classData.id}`)
  }

  const handleEdit = (classData: Class) => {
    router.push(`/dashboard/classes/${classData.id}/edit`)
  }

  const handleDelete = async (classData: Class) => {
    if (confirm(`Are you sure you want to delete ${classData.name} - ${classData.section}?`)) {
      try {
        await updateDoc(doc(db, "classes", classData.id), {
          isActive: false,
          updatedAt: new Date(),
        })
        setClasses((prev) => prev.filter((c) => c.id !== classData.id))
      } catch (error) {
        console.error("Error deleting class:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Classes" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading classes...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Classes" }]} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Classes</h2>
            <p className="text-muted-foreground">Manage your school's classes and sections</p>
          </div>
          <Link href="/dashboard/classes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Search Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by class name, section, or grade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground">
                {searchTerm
                  ? "No classes found matching your search criteria."
                  : "No classes found. Add your first class to get started."}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.map((classData) => (
              <ClassCard
                key={classData.id}
                classData={classData}
                teacherName={getTeacherName(classData.classTeacherId)}
                studentCount={getStudentCount(classData.id)}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredClasses.length} of {classes.length} classes
        </div>
      </div>
    </div>
  )
}
