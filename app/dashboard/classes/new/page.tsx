"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ClassForm } from "@/components/academic/class-form"
import type { Class } from "@/lib/types/academic"

export default function NewClassPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (classData: Partial<Class>) => {
    setIsLoading(true)
    try {
      // Implement Firebase class creation
      console.log("Creating class:", classData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      router.push("/dashboard/classes")
    } catch (error) {
      console.error("Error creating class:", error)
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
          { title: "Classes", href: "/dashboard/classes" },
          { title: "Add New Class" },
        ]}
      />

      <ClassForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}
