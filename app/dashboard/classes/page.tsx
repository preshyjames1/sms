"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClassCard } from "@/components/academic/class-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus } from "lucide-react"
import type { Class } from "@/lib/types/academic"
import Link from "next/link"

// Mock data - replace with actual Firebase queries
const mockClasses: Class[] = [
  {
    id: "1",
    schoolId: "school1",
    name: "Mathematics",
    section: "A",
    grade: "10",
    capacity: 30,
    classTeacherId: "teacher1",
    subjects: ["Algebra", "Geometry", "Statistics"],
    academicYear: "2024",
    room: "Room 101",
    description: "Advanced mathematics class for grade 10 students",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    schoolId: "school1",
    name: "Science",
    section: "B",
    grade: "9",
    capacity: 25,
    classTeacherId: "teacher2",
    subjects: ["Physics", "Chemistry", "Biology"],
    academicYear: "2024",
    room: "Lab 201",
    description: "Integrated science class for grade 9 students",
    isActive: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
]

export default function ClassesPage() {
  const router = useRouter()
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setClasses(mockClasses)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredClasses = classes.filter(
    (classData) =>
      classData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classData.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classData.grade.includes(searchTerm),
  )

  const handleView = (classData: Class) => {
    router.push(`/dashboard/classes/${classData.id}`)
  }

  const handleEdit = (classData: Class) => {
    router.push(`/dashboard/classes/${classData.id}/edit`)
  }

  const handleDelete = async (classData: Class) => {
    if (confirm(`Are you sure you want to delete ${classData.name} - ${classData.section}?`)) {
      // Implement delete logic
      console.log("Delete class:", classData.id)
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
            <CardContent className="text-center py-8">
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
                teacherName="Sarah Johnson" // Mock teacher name
                studentCount={Math.floor(Math.random() * classData.capacity)} // Mock student count
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
