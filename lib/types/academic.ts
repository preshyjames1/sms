export interface Class {
  id: string
  schoolId: string
  name: string
  section: string
  grade: string
  capacity: number
  classTeacherId?: string
  subjects: string[]
  academicYear: string
  room?: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Subject {
  id: string
  schoolId: string
  name: string
  code: string
  description?: string
  department?: string
  credits?: number
  isCore: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TimetableSlot {
  id: string
  classId: string
  subjectId: string
  teacherId: string
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  room?: string
}

export interface Timetable {
  id: string
  schoolId: string
  classId: string
  academicYear: string
  slots: TimetableSlot[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AttendanceRecord {
  id: string
  schoolId: string
  classId: string
  studentId: string
  date: Date
  status: "present" | "absent" | "late" | "excused"
  markedBy: string
  notes?: string
  createdAt: Date
}

export interface AttendanceSession {
  id: string
  schoolId: string
  classId: string
  date: Date
  markedBy: string
  totalStudents: number
  presentCount: number
  absentCount: number
  lateCount: number
  excusedCount: number
  records: AttendanceRecord[]
  createdAt: Date
}
