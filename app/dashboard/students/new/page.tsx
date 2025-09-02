"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserForm } from "@/components/users/user-form"
import type { User } from "@/lib/types"

export default function NewStudentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (userData: Partial<User>) => {
    setIsLoading(true)
    try {
      // Implement Firebase user creation
      console.log("Creating student:", userData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      router.push("/dashboard/students")
    } catch (error) {
      console.error("Error creating student:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Students", href: "/dashboard/students" },
          { title: "Add New Student" },
        ]}
      />

      <UserForm userType="students" onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}
