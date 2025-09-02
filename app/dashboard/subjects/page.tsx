"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PermissionGuard } from "@/components/permissions/permission-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Plus, BookOpen, Users, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface Subject {
  id: string
  schoolId: string
  name: string
  code: string
  description?: string
  department: string
  credits: number
  teacherIds: string[]
  classIds: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export default function SubjectsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!user?.schoolId) return

      try {
        const subjectsQuery = query(
          collection(db, "subjects"),
          where("schoolId", "==", user.schoolId),
          where("isActive", "==", true),
        )
        const snapshot = await getDocs(subjectsQuery)
        const subjectsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Subject[]

        setSubjects(subjectsData)
      } catch (error) {
        console.error("Error fetching subjects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [user?.schoolId])

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleView = (subject: Subject) => {
    router.push(`/dashboard/subjects/${subject.id}`)
  }

  const handleEdit = (subject: Subject) => {
    router.push(`/dashboard/subjects/${subject.id}/edit`)
  }

  const handleDelete = async (subject: Subject) => {
    if (confirm(`Are you sure you want to delete ${subject.name}?`)) {
      // Implement delete logic
      console.log("Delete subject:", subject.id)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Subjects" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading subjects...</div>
        </div>
      </div>
    )
  }

  return (
    <PermissionGuard
      module="subjects"
      action="view"
      fallback={
        <Alert>
          <AlertDescription>You don't have permission to view subjects.</AlertDescription>
        </Alert>
      }
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Subjects" }]} />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Subjects</h2>
              <p className="text-muted-foreground">Manage your school's curriculum and subjects</p>
            </div>
            <PermissionGuard module="subjects" action="create">
              <Link href="/dashboard/subjects/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subject
                </Button>
              </Link>
            </PermissionGuard>
          </div>

          {/* Search */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Search Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by subject name, code, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardContent>
          </Card>

          {/* Subjects Grid */}
          {filteredSubjects.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Subjects Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "No subjects found matching your search criteria."
                    : "Start by adding subjects to your school's curriculum."}
                </p>
                <PermissionGuard module="subjects" action="create">
                  <Link href="/dashboard/subjects/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Subject
                    </Button>
                  </Link>
                </PermissionGuard>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubjects.map((subject) => (
                <Card key={subject.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base">{subject.name}</CardTitle>
                      <CardDescription>{subject.code}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(subject)}>View Details</DropdownMenuItem>
                        <PermissionGuard module="subjects" action="edit">
                          <DropdownMenuItem onClick={() => handleEdit(subject)}>Edit Subject</DropdownMenuItem>
                        </PermissionGuard>
                        <PermissionGuard module="subjects" action="delete">
                          <DropdownMenuItem onClick={() => handleDelete(subject)} className="text-destructive">
                            Delete Subject
                          </DropdownMenuItem>
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Department</span>
                      <Badge variant="secondary">{subject.department}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Credits</span>
                      <span>{subject.credits}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Teachers</span>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{subject.teacherIds.length}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Classes</span>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        <span>{subject.classIds.length}</span>
                      </div>
                    </div>
                    {subject.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{subject.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredSubjects.length} of {subjects.length} subjects
          </div>
        </div>
      </div>
    </PermissionGuard>
  )
}
