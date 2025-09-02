"use client"

import { useAuth } from "@/lib/auth/context"
import { hasPermission, canAccessModule } from "@/lib/permissions"
import type { PermissionModule, PermissionAction } from "@/lib/types"
import type { ReactNode } from "react"

interface PermissionGuardProps {
  module: PermissionModule
  action?: PermissionAction
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionGuard({ module, action = "view", children, fallback = null }: PermissionGuardProps) {
  const { user } = useAuth()

  if (!hasPermission(user, module, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface ModuleGuardProps {
  module: PermissionModule
  children: ReactNode
  fallback?: ReactNode
}

export function ModuleGuard({ module, children, fallback = null }: ModuleGuardProps) {
  const { user } = useAuth()

  if (!canAccessModule(user, module)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
