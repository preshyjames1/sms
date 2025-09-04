"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/context"
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AttendanceTracker } from "@/components/academic/attendance-tracker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { AttendanceRecord } from "@/lib/types/academic"

export default function AttendancePage() {
  const { user } = useAuth()
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [students, setStudents] = useState<any[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [existingRecords, setExistingRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user?.schoolId) return

      try {
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
      } catch (error) {
        console.error("Error fetching classes:", error)
      } finally {
        setDataLoading(false)
      }
    }

    fetchClasses()
  }, [user?.schoolId])

  useEffect(() => {
    const fetchStudentsAndAttendance = async () => {
      if (!selectedClass || !user?.schoolId) return

      setDataLoading(true)
      try {
        // Fetch students for selected class
        const studentsQuery = query(
          collection(db, "users"),
          where("schoolId", "==", user.schoolId),
          where("role", "==", "student"),
          where("profile.classId", "==", selectedClass),
          where("isActive", "==", true),
        )
        const studentsSnapshot = await getDocs(studentsQuery)
        const studentsData = studentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: `${doc.data().profile?.firstName} ${doc.data().profile?.lastName}`,
          rollNumber: doc.data().profile?.rollNumber || doc.id.slice(-3),
          avatar: doc.data().profile?.avatar,
          ...doc.data(),
        }))
        setStudents(studentsData)

        // Fetch existing attendance records for the selected date
        const attendanceQuery = query(
          collection(db, "attendance"),
          where("schoolId", "==", user.schoolId),
          where("classId", "==", selectedClass),
          where("date", "==", format(selectedDate, "yyyy-MM-dd")),
        )
        const attendanceSnapshot = await getDocs(attendanceQuery)
        const attendanceData = attendanceSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as AttendanceRecord[]
        setExistingRecords(attendanceData)
      } catch (error) {
        console.error("Error fetching students and attendance:", error)
      } finally {
        setDataLoading(false)
      }
    }

    fetchStudentsAndAttendance()
  }, [selectedClass, selectedDate, user?.schoolId])

  const handleSaveAttendance = async (records: Partial<AttendanceRecord>[]) => {
    if (!user?.schoolId || !selectedClass) return

    setLoading(true)
    try {
      const dateString = format(selectedDate, "yyyy-MM-dd")

      for (const record of records) {
        const attendanceData = {
          schoolId: user.schoolId,
          classId: selectedClass,
          studentId: record.studentId,
          date: dateString,
          status: record.status,
          notes: record.notes || "",
          markedBy: user.uid,
          markedAt: new Date(),
        }

        // Check if record already exists
        const existingRecord = existingRecords.find((r) => r.studentId === record.studentId)

        if (existingRecord) {
          // Update existing record
          await updateDoc(doc(db, "attendance", existingRecord.id), {
            status: record.status,
            notes: record.notes || "",
            markedBy: user.uid,
            markedAt: new Date(),
          })
        } else {
          // Create new record
          await addDoc(collection(db, "attendance"), attendanceData)
        }
      }

      // Refresh existing records
      const attendanceQuery = query(
        collection(db, "attendance"),
        where("schoolId", "==", user.schoolId),
        where("classId", "==", selectedClass),
        where("date", "==", dateString),
      )
      const attendanceSnapshot = await getDocs(attendanceQuery)
      const attendanceData = attendanceSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AttendanceRecord[]
      setExistingRecords(attendanceData)

      alert("Attendance saved successfully!")
    } catch (error) {
      console.error("Error saving attendance:", error)
      alert("Failed to save attendance")
    } finally {
      setLoading(false)
    }
  }

  if (dataLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Attendance" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading attendance data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Attendance" }]} />

      <div className="space-y-6">
        {/* Class and Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Settings</CardTitle>
            <CardDescription>Select class and date to mark attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classData) => (
                      <SelectItem key={classData.id} value={classData.id}>
                        {classData.name} - {classData.section} (Grade {classData.grade})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Tracker */}
        {selectedClass && students.length > 0 ? (
          <AttendanceTracker
            students={students}
            date={selectedDate}
            onSave={handleSaveAttendance}
            existingRecords={existingRecords}
            isLoading={loading}
          />
        ) : selectedClass && students.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-muted-foreground">No students found in this class.</div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-muted-foreground">Please select a class to start marking attendance.</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
