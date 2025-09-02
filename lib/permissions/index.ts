import type { User, Permission, PermissionModule, PermissionAction, UserRole, RoleTemplate } from "@/lib/types"

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    // Super admin has all permissions
    { module: "dashboard", actions: ["view"] },
    { module: "students", actions: ["view", "create", "edit", "delete", "export", "import"] },
    { module: "teachers", actions: ["view", "create", "edit", "delete", "export", "import"] },
    { module: "parents", actions: ["view", "create", "edit", "delete", "export", "import"] },
    { module: "staff", actions: ["view", "create", "edit", "delete", "export", "import"] },
    { module: "classes", actions: ["view", "create", "edit", "delete"] },
    { module: "subjects", actions: ["view", "create", "edit", "delete"] },
    { module: "timetable", actions: ["view", "create", "edit", "delete"] },
    { module: "attendance", actions: ["view", "create", "edit", "delete", "export"] },
    { module: "examinations", actions: ["view", "create", "edit", "delete"] },
    { module: "grades", actions: ["view", "create", "edit", "delete", "export"] },
    { module: "library", actions: ["view", "create", "edit", "delete"] },
    { module: "transport", actions: ["view", "create", "edit", "delete"] },
    { module: "hostel", actions: ["view", "create", "edit", "delete"] },
    { module: "accounting", actions: ["view", "create", "edit", "delete", "export"] },
    { module: "fees", actions: ["view", "create", "edit", "delete", "export"] },
    { module: "payroll", actions: ["view", "create", "edit", "delete", "export"] },
    { module: "inventory", actions: ["view", "create", "edit", "delete"] },
    { module: "messages", actions: ["view", "create", "edit", "delete"] },
    { module: "announcements", actions: ["view", "create", "edit", "delete"] },
    { module: "reports", actions: ["view", "export"] },
    { module: "analytics", actions: ["view"] },
    { module: "settings", actions: ["view", "edit"] },
    { module: "billing", actions: ["view", "edit"] },
    { module: "users", actions: ["view", "create", "edit", "delete"] },
    { module: "roles", actions: ["view", "create", "edit", "delete"] },
  ],
  school_admin: [
    // School admin has most permissions except super admin functions
    { module: "dashboard", actions: ["view"] },
    { module: "students", actions: ["view", "create", "edit", "delete", "export", "import"] },
    { module: "teachers", actions: ["view", "create", "edit", "delete", "export", "import"] },
    { module: "parents", actions: ["view", "create", "edit", "delete", "export", "import"] },
    { module: "staff", actions: ["view", "create", "edit", "delete", "export", "import"] },
    { module: "classes", actions: ["view", "create", "edit", "delete"] },
    { module: "subjects", actions: ["view", "create", "edit", "delete"] },
    { module: "timetable", actions: ["view", "create", "edit", "delete"] },
    { module: "attendance", actions: ["view", "create", "edit", "delete", "export"] },
    { module: "examinations", actions: ["view", "create", "edit", "delete"] },
    { module: "grades", actions: ["view", "create", "edit", "delete", "export"] },
    { module: "library", actions: ["view", "create", "edit", "delete"] },
    { module: "transport", actions: ["view", "create", "edit", "delete"] },
    { module: "hostel", actions: ["view", "create", "edit", "delete"] },
    { module: "accounting", actions: ["view", "create", "edit", "delete", "export"] },
    { module: "fees", actions: ["view", "create", "edit", "delete", "export"] },
    { module: "payroll", actions: ["view", "create", "edit", "delete", "export"] },
    { module: "inventory", actions: ["view", "create", "edit", "delete"] },
    { module: "messages", actions: ["view", "create", "edit", "delete"] },
    { module: "announcements", actions: ["view", "create", "edit", "delete"] },
    { module: "reports", actions: ["view", "export"] },
    { module: "analytics", actions: ["view"] },
    { module: "settings", actions: ["view", "edit"] },
    { module: "billing", actions: ["view", "edit"] },
    { module: "users", actions: ["view", "create", "edit", "delete"] },
    { module: "roles", actions: ["view", "create", "edit", "delete"] },
  ],
  sub_admin: [
    // Sub-admin permissions are customizable, these are defaults
    { module: "dashboard", actions: ["view"] },
    { module: "students", actions: ["view", "create", "edit"] },
    { module: "teachers", actions: ["view"] },
    { module: "parents", actions: ["view", "create", "edit"] },
    { module: "classes", actions: ["view"] },
    { module: "attendance", actions: ["view", "create", "edit"] },
    { module: "messages", actions: ["view", "create"] },
    { module: "announcements", actions: ["view"] },
    { module: "reports", actions: ["view"] },
  ],
  teacher: [
    { module: "dashboard", actions: ["view"] },
    { module: "students", actions: ["view"] },
    { module: "classes", actions: ["view"] },
    { module: "subjects", actions: ["view"] },
    { module: "timetable", actions: ["view"] },
    { module: "attendance", actions: ["view", "create", "edit"] },
    { module: "examinations", actions: ["view", "create", "edit"] },
    { module: "grades", actions: ["view", "create", "edit"] },
    { module: "messages", actions: ["view", "create"] },
    { module: "announcements", actions: ["view"] },
  ],
  student: [
    { module: "dashboard", actions: ["view"] },
    { module: "timetable", actions: ["view"] },
    { module: "attendance", actions: ["view"] },
    { module: "examinations", actions: ["view"] },
    { module: "grades", actions: ["view"] },
    { module: "library", actions: ["view"] },
    { module: "messages", actions: ["view", "create"] },
    { module: "announcements", actions: ["view"] },
  ],
  parent: [
    { module: "dashboard", actions: ["view"] },
    { module: "students", actions: ["view"] }, // Only their children
    { module: "timetable", actions: ["view"] },
    { module: "attendance", actions: ["view"] },
    { module: "examinations", actions: ["view"] },
    { module: "grades", actions: ["view"] },
    { module: "fees", actions: ["view"] },
    { module: "messages", actions: ["view", "create"] },
    { module: "announcements", actions: ["view"] },
  ],
  accountant: [
    { module: "dashboard", actions: ["view"] },
    { module: "students", actions: ["view"] },
    { module: "accounting", actions: ["view", "create", "edit", "delete", "export"] },
    { module: "fees", actions: ["view", "create", "edit", "delete", "export"] },
    { module: "payroll", actions: ["view", "create", "edit", "delete", "export"] },
    { module: "reports", actions: ["view", "export"] },
  ],
  librarian: [
    { module: "dashboard", actions: ["view"] },
    { module: "students", actions: ["view"] },
    { module: "teachers", actions: ["view"] },
    { module: "library", actions: ["view", "create", "edit", "delete"] },
    { module: "inventory", actions: ["view", "create", "edit", "delete"] },
    { module: "reports", actions: ["view", "export"] },
  ],
  receptionist: [
    { module: "dashboard", actions: ["view"] },
    { module: "students", actions: ["view", "create", "edit"] },
    { module: "teachers", actions: ["view"] },
    { module: "parents", actions: ["view", "create", "edit"] },
    { module: "messages", actions: ["view", "create"] },
    { module: "announcements", actions: ["view"] },
  ],
  nurse: [
    { module: "dashboard", actions: ["view"] },
    { module: "students", actions: ["view"] },
    { module: "teachers", actions: ["view"] },
    { module: "messages", actions: ["view", "create"] },
  ],
  security: [
    { module: "dashboard", actions: ["view"] },
    { module: "students", actions: ["view"] },
    { module: "teachers", actions: ["view"] },
    { module: "messages", actions: ["view", "create"] },
  ],
  maintenance: [
    { module: "dashboard", actions: ["view"] },
    { module: "inventory", actions: ["view", "create", "edit"] },
    { module: "messages", actions: ["view", "create"] },
  ],
}

export function hasPermission(user: User | null, module: PermissionModule, action: PermissionAction): boolean {
  if (!user) return false

  // Super admin has all permissions
  if (user.role === "super_admin") return true

  // Check custom permissions first (for sub-admins)
  if (user.permissions && user.permissions.length > 0) {
    const modulePermission = user.permissions.find((p) => p.module === module)
    return modulePermission?.actions.includes(action) || false
  }

  // Check default role permissions
  const rolePermissions = DEFAULT_ROLE_PERMISSIONS[user.role] || []
  const modulePermission = rolePermissions.find((p) => p.module === module)
  return modulePermission?.actions.includes(action) || false
}

export function getUserPermissions(user: User | null): Permission[] {
  if (!user) return []

  // Return custom permissions if available (for sub-admins)
  if (user.permissions && user.permissions.length > 0) {
    return user.permissions
  }

  // Return default role permissions
  return DEFAULT_ROLE_PERMISSIONS[user.role] || []
}

export function canAccessModule(user: User | null, module: PermissionModule): boolean {
  return hasPermission(user, module, "view")
}

export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    name: "Academic Coordinator",
    description: "Manages academic activities, classes, and timetables",
    suggestedFor: ["sub_admin"],
    permissions: [
      { module: "dashboard", actions: ["view"] },
      { module: "students", actions: ["view", "edit"] },
      { module: "teachers", actions: ["view"] },
      { module: "classes", actions: ["view", "create", "edit", "delete"] },
      { module: "subjects", actions: ["view", "create", "edit", "delete"] },
      { module: "timetable", actions: ["view", "create", "edit", "delete"] },
      { module: "examinations", actions: ["view", "create", "edit", "delete"] },
      { module: "reports", actions: ["view", "export"] },
    ],
  },
  {
    name: "Student Affairs Manager",
    description: "Manages student enrollment, attendance, and activities",
    suggestedFor: ["sub_admin"],
    permissions: [
      { module: "dashboard", actions: ["view"] },
      { module: "students", actions: ["view", "create", "edit", "delete", "export", "import"] },
      { module: "parents", actions: ["view", "create", "edit"] },
      { module: "attendance", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "messages", actions: ["view", "create", "edit", "delete"] },
      { module: "announcements", actions: ["view", "create", "edit", "delete"] },
      { module: "reports", actions: ["view", "export"] },
    ],
  },
  {
    name: "HR Manager",
    description: "Manages staff, teachers, and payroll",
    suggestedFor: ["sub_admin"],
    permissions: [
      { module: "dashboard", actions: ["view"] },
      { module: "teachers", actions: ["view", "create", "edit", "delete", "export", "import"] },
      { module: "staff", actions: ["view", "create", "edit", "delete", "export", "import"] },
      { module: "payroll", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "users", actions: ["view", "create", "edit"] },
      { module: "reports", actions: ["view", "export"] },
    ],
  },
  {
    name: "Finance Manager",
    description: "Manages accounting, fees, and financial reports",
    suggestedFor: ["sub_admin"],
    permissions: [
      { module: "dashboard", actions: ["view"] },
      { module: "students", actions: ["view"] },
      { module: "accounting", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "fees", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "payroll", actions: ["view", "create", "edit", "delete", "export"] },
      { module: "reports", actions: ["view", "export"] },
      { module: "analytics", actions: ["view"] },
    ],
  },
]
