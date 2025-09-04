"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Bell, Search, School } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DashboardHeaderProps {
  breadcrumbs?: Array<{
    title: string
    href?: string
  }>
}

export function DashboardHeader({ breadcrumbs = [] }: DashboardHeaderProps) {
  const { user } = useAuth()
  const [schoolName, setSchoolName] = useState<string>("")

  useEffect(() => {
    const fetchSchoolName = async () => {
      if (user?.schoolId) {
        try {
          const schoolDoc = await getDoc(doc(db, "schools", user.schoolId))
          if (schoolDoc.exists()) {
            const schoolData = schoolDoc.data()
            setSchoolName(schoolData.name || "My School")
          }
        } catch (error) {
          console.error("Error fetching school data:", error)
          setSchoolName("My School")
        }
      }
    }

    fetchSchoolName()
  }, [user?.schoolId])

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        {schoolName && (
          <>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <School className="h-4 w-4" />
              <span>{schoolName}</span>
            </div>
            <Separator orientation="vertical" className="mx-2 h-4" />
          </>
        )}

        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => (
                <div key={breadcrumb.title} className="flex items-center gap-2">
                  <BreadcrumbItem>
                    {breadcrumb.href ? (
                      <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.title}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 px-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="w-[300px] pl-8" />
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}
