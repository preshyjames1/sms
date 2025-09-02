"use client"

import type React from "react"

import { useAuth } from "@/lib/auth/context"
import type { UserRole } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export function ProtectedRoute({ children, allowedRoles = [], redirectTo = "/auth/login" }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
        return
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [user, loading, allowedRoles, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return null
  }

  return <>{children}</>
}
