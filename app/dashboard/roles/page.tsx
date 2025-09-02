"use client"

import { PermissionGuard } from "@/components/permissions/permission-guard"
import { RoleManagement } from "@/components/roles/role-management"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

export default function RolesPage() {
  return (
    <PermissionGuard
      module="roles"
      action="view"
      fallback={
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>You don't have permission to access role management.</AlertDescription>
        </Alert>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Create and manage custom roles with specific permissions for your school staff
          </p>
        </div>

        <RoleManagement />
      </div>
    </PermissionGuard>
  )
}
