"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/context"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PermissionGuard } from "@/components/permissions/permission-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, BookOpen } from "lucide-react"
import Link from "next/link"

interface TimetableEntry {
  id: string
  schoolId: string
  classId: string
  subjectId: string
  teacherId: string
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
  startTime: string
  endTime: string
  room?: string
  isActive: boolean
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
]

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

export default function TimetablePage() {
  const { user } = useAuth()
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState<string>("")

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
        }))
        setClasses(classesData)

        // Fetch subjects
        const subjectsQuery = query(
          collection(db, "subjects"),
          where("schoolId", "==", user.schoolId),
          where("isActive", "==", true),
        )
        const subjectsSnapshot = await getDocs(subjectsQuery)
        const subjectsData = subjectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setSubjects(subjectsData)

        // Fetch teachers
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

        // Fetch timetable entries
        const timetableQuery = query(
          collection(db, "timetable"),
          where("schoolId", "==", user.schoolId),
          where("isActive", "==", true),
        )
        const timetableSnapshot = await getDocs(timetableQuery)
        const timetableData = timetableSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as TimetableEntry[]
        setTimetableEntries(timetableData)
      } catch (error) {
        console.error("Error fetching timetable data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.schoolId])

  const getClassEntries = (classId: string) => {
    return timetableEntries.filter((entry) => entry.classId === classId)
  }

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject?.name || "Unknown Subject"
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId)
    return teacher ? `${teacher.profile?.firstName} ${teacher.profile?.lastName}` : "Unknown Teacher"
  }

  const getClassName = (classId: string) => {
    const classData = classes.find((c) => c.id === classId)
    return classData ? `${classData.name} - ${classData.section}` : "Unknown Class"
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Timetable" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading timetable...</div>
        </div>
      </div>
    )
  }

  return (
    <PermissionGuard
      module="timetable"
      action="view"
      fallback={
        <Alert>
          <AlertDescription>You don't have permission to view timetables.</AlertDescription>
        </Alert>
      }
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Timetable" }]} />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Timetable</h2>
              <p className="text-muted-foreground">Manage class schedules and time slots</p>
            </div>
            <PermissionGuard module="timetable" action="create">
              <Link href="/dashboard/timetable/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Schedule
                </Button>
              </Link>
            </PermissionGuard>
          </div>

          {/* Class Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Select Class</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a class to view timetable" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classData) => (
                    <SelectItem key={classData.id} value={classData.id}>
                      {getClassName(classData.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Timetable Grid */}
          {selectedClass ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {getClassName(selectedClass)} - Weekly Schedule
                </CardTitle>
                <CardDescription>View and manage the weekly schedule for this class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border p-2 bg-muted text-left font-medium">Time</th>
                        {DAYS_OF_WEEK.map((day) => (
                          <th key={day.value} className="border p-2 bg-muted text-center font-medium">
                            {day.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TIME_SLOTS.map((timeSlot, index) => {
                        const nextTimeSlot = TIME_SLOTS[index + 1] || "17:00"
                        return (
                          <tr key={timeSlot}>
                            <td className="border p-2 font-medium text-sm">
                              {timeSlot} - {nextTimeSlot}
                            </td>
                            {DAYS_OF_WEEK.map((day) => {
                              const entry = getClassEntries(selectedClass).find(
                                (e) => e.dayOfWeek === day.value && e.startTime === timeSlot,
                              )
                              return (
                                <td key={day.value} className="border p-2 text-center">
                                  {entry ? (
                                    <div className="space-y-1">
                                      <Badge variant="default" className="text-xs">
                                        {getSubjectName(entry.subjectId)}
                                      </Badge>
                                      <div className="text-xs text-muted-foreground">
                                        {getTeacherName(entry.teacherId)}
                                      </div>
                                      {entry.room && <div className="text-xs text-muted-foreground">{entry.room}</div>}
                                    </div>
                                  ) : (
                                    <div className="text-xs text-muted-foreground">-</div>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Class</h3>
                <p className="text-muted-foreground mb-4">
                  Choose a class from the dropdown above to view its timetable
                </p>
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          {classes.length === 0 && (
            <Alert>
              <BookOpen className="h-4 w-4" />
              <AlertDescription>
                No classes found. Please add classes first before creating timetables.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </PermissionGuard>
  )
}
