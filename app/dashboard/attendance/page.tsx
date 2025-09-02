"use client"

import { useState } from "react"
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

// Mock data
const mockStudents = [
  { id: "1", name: "John Doe", rollNumber: "001" },
  { id: "2", name: "Jane Smith", rollNumber: "002" },
  { id: "3", name: "Mike Johnson", rollNumber: "003" },
  { id: "4", name: "Sarah Wilson", rollNumber: "004" },
]

const mockClasses = [
  { id: "1", name: "Mathematics - A", grade: "10" },
  { id: "2", name: "Science - B", grade: "9" },
]

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [students, setStudents] = useState(mockStudents)
  const [loading, setLoading] = useState(false)

  const handleSaveAttendance = async (records: Partial<AttendanceRecord>[]) => {
    setLoading(true)
    try {
      // Implement Firebase attendance saving
      console.log("Saving attendance:", records)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      alert("Attendance saved successfully!")
    } catch (error) {
      console.error("Error saving attendance:", error)
      alert("Failed to save attendance")
    } finally {
      setLoading(false)
    }
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
                    {mockClasses.map((classData) => (
                      <SelectItem key={classData.id} value={classData.id}>
                        {classData.name} (Grade {classData.grade})
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
        {selectedClass && (
          <AttendanceTracker
            students={students}
            date={selectedDate}
            onSave={handleSaveAttendance}
            isLoading={loading}
          />
        )}

        {!selectedClass && (
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
