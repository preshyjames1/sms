export const APP_NAME = "SchoolManagementSystem.com"
export const APP_DESCRIPTION = "Complete School Management Solution"

export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  SCHOOL_ADMIN: "school_admin",
  TEACHER: "teacher",
  STUDENT: "student",
  PARENT: "parent",
  ACCOUNTANT: "accountant",
  LIBRARIAN: "librarian",
} as const

export const SUBSCRIPTION_PLANS = {
  FREE: "free",
  BASIC: "basic",
  PREMIUM: "premium",
  ENTERPRISE: "enterprise",
} as const

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  DASHBOARD: "/dashboard",
  ADMIN: "/admin",
  STUDENTS: "/students",
  TEACHERS: "/teachers",
  CLASSES: "/classes",
  ATTENDANCE: "/attendance",
  EXAMINATIONS: "/examinations",
  REPORTS: "/reports",
  SETTINGS: "/settings",
} as const

export const PERMISSIONS = {
  // Admin permissions
  MANAGE_SCHOOL: "manage_school",
  MANAGE_USERS: "manage_users",
  MANAGE_CLASSES: "manage_classes",
  VIEW_REPORTS: "view_reports",

  // Teacher permissions
  MANAGE_STUDENTS: "manage_students",
  TAKE_ATTENDANCE: "take_attendance",
  CREATE_ASSIGNMENTS: "create_assignments",
  GRADE_EXAMS: "grade_exams",

  // Student permissions
  VIEW_GRADES: "view_grades",
  VIEW_ATTENDANCE: "view_attendance",
  SUBMIT_ASSIGNMENTS: "submit_assignments",

  // Parent permissions
  VIEW_CHILD_DATA: "view_child_data",
  COMMUNICATE_TEACHERS: "communicate_teachers",
} as const
