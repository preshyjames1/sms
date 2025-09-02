"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, Clock, AlertCircle, Save } from "lucide-react"
import type { AttendanceRecord } from "@/lib/types/academic"

interface Student {
  id: string
  name: string
  rollNumber: string
  avatar?: string
}

interface AttendanceTrackerProps {
  students: Student[]
  date: Date
  onSave: (records: Partial<AttendanceRecord>[]) => Promise<void>
  existingRecords?: AttendanceRecord[]
  isLoading?: boolean
}

export function AttendanceTracker({
  students,
  date,
  onSave,
  existingRecords = [],
  isLoading = false,
}: AttendanceTrackerProps) {
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: string; notes: string }>>(() => {
    const initial: Record<string, { status: string; notes: string }> = {}
    students.forEach((student) => {
      const existing = existingRecords.find((record) => record.studentId === student.id)
      initial[student.id] = {
        status: existing?.status || "present",
        notes: existing?.notes || "",
      }
    })
    return initial
  })

  const updateAttendance = (studentId: string, status: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }))
  }

  const updateNotes = (studentId: string, notes: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
      },
    }))
  }

  const handleSave = async () => {
    const records: Partial<AttendanceRecord>[] = students.map((student) => ({
      studentId: student.id,
      date,
      status: attendanceData[student.id]?.status as "present" | "absent" | "late" | "excused",
      notes: attendanceData[student.id]?.notes,
    }))

    await onSave(records)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "late":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "excused":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "default"
      case "absent":
        return "destructive"
      case "late":
        return "secondary"
      case "excused":
        return "outline"
      default:
        return "default"
    }
  }

  const stats = students.reduce(
    (acc, student) => {
      const status = attendanceData[student.id]?.status || "present"
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Attendance Tracker</h2>
          <p className="text-muted-foreground">Mark attendance for {date.toLocaleDateString()}</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save Attendance"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Present</p>
                <p className="text-2xl font-bold">{stats.present || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Absent</p>
                <p className="text-2xl font-bold">{stats.absent || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Late</p>
                <p className="text-2xl font-bold">{stats.late || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Excused</p>
                <p className="text-2xl font-bold">{stats.excused || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>Mark attendance for each student</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {students.map((student) => (
            <div key={student.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={student.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-muted-foreground">Roll No: {student.rollNumber}</p>
              </div>

              <div className="flex items-center gap-2">
                {getStatusIcon(attendanceData[student.id]?.status || "present")}
                <Select
                  value={attendanceData[student.id]?.status || "present"}
                  onValueChange={(value) => updateAttendance(student.id, value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="excused">Excused</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-48">
                <Textarea
                  placeholder="Notes (optional)"
                  value={attendanceData[student.id]?.notes || ""}
                  onChange={(e) => updateNotes(student.id, e.target.value)}
                  className="min-h-[60px]"
                  disabled={isLoading}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
