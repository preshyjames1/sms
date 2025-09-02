"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["school_admin", "teacher", "student", "parent"]}>
      <SidebarProvider defaultOpen={true}>
        <SidebarNav />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
