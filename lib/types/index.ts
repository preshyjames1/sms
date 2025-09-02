export interface User {
  id: string
  email: string
  role: UserRole
  schoolId: string
  profile: UserProfile
  permissions?: Permission[]
  customRole?: CustomRole
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export type UserRole =
  | "super_admin"
  | "school_admin"
  | "sub_admin"
  | "teacher"
  | "student"
  | "parent"
  | "accountant"
  | "librarian"
  | "receptionist"
  | "nurse"
  | "security"
  | "maintenance"

export interface Permission {
  module: PermissionModule
  actions: PermissionAction[]
}

export type PermissionModule =
  | "dashboard"
  | "students"
  | "teachers"
  | "parents"
  | "staff"
  | "classes"
  | "subjects"
  | "timetable"
  | "attendance"
  | "examinations"
  | "grades"
  | "library"
  | "transport"
  | "hostel"
  | "accounting"
  | "fees"
  | "payroll"
  | "inventory"
  | "messages"
  | "announcements"
  | "reports"
  | "analytics"
  | "settings"
  | "billing"
  | "users"
  | "roles"

export type PermissionAction = "view" | "create" | "edit" | "delete" | "export" | "import"

export interface CustomRole {
  id: string
  name: string
  description: string
  permissions: Permission[]
  schoolId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface RoleTemplate {
  name: string
  description: string
  permissions: Permission[]
  suggestedFor: UserRole[]
}

export interface UserProfile {
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  avatarPath?: string
  address?: Address
  dateOfBirth?: Date
  gender?: "male" | "female" | "other"
}

export interface Address {
  street: string
  city: string
  state: string
  country: string
  zipCode: string
}

export interface School {
  id: string
  name: string
  address: Address
  phone: string
  email: string
  website?: string
  logo?: string
  adminId: string
  settings: SchoolSettings
  subscription: SubscriptionPlan
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface SchoolSettings {
  academicYear: string
  currency: string
  timezone: string
  language: string
  features: FeatureFlags
}

export interface FeatureFlags {
  attendance: boolean
  examinations: boolean
  library: boolean
  transport: boolean
  hostel: boolean
  accounting: boolean
  messaging: boolean
}

export type SubscriptionPlan = "free" | "basic" | "premium" | "enterprise"

export interface Class {
  id: string
  schoolId: string
  name: string
  section: string
  capacity: number
  classTeacherId?: string
  subjects: string[]
  academicYear: string
  isActive: boolean
}

export interface Student {
  id: string
  schoolId: string
  classId: string
  admissionNumber: string
  profile: UserProfile
  parentIds: string[]
  medicalInfo?: MedicalInfo
  academicInfo: AcademicInfo
  enrollmentDate: Date
  isActive: boolean
}

export interface MedicalInfo {
  bloodGroup?: string
  allergies?: string[]
  medications?: string[]
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

export interface AcademicInfo {
  previousSchool?: string
  previousGrade?: string
  specialNeeds?: string[]
  achievements?: string[]
}

export interface Teacher {
  id: string
  schoolId: string
  employeeId: string
  profile: UserProfile
  subjects: string[]
  classes: string[]
  qualifications: Qualification[]
  joinDate: Date
  salary?: number
  isActive: boolean
}

export interface Qualification {
  degree: string
  institution: string
  year: number
  grade?: string
}
