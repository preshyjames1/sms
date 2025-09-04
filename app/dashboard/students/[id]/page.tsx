"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Mail, Calendar } from "lucide-react"
import type { User } from "@/lib/types"

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudent = async () => {
      if (!params.id) return

      try {
        const studentDoc = await getDoc(doc(db, "users", params.id as string))
        if (studentDoc.exists()) {
          setStudent({ id: studentDoc.id, ...studentDoc.data() } as User)
        }
      } catch (error) {
        console.error("Error fetching student:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader
          breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Students", href: "/dashboard/students" },
            { title: "Loading..." },
          ]}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading student details...</div>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader
          breadcrumbs={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Students", href: "/dashboard/students" },
            { title: "Not Found" },
          ]}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Student not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader
        breadcrumbs={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Students", href: "/dashboard/students" },
          { title: `${student.profile.firstName} ${student.profile.lastName}` },
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={student.profile.avatar || "/placeholder.svg"} alt={student.profile.firstName} />
            <AvatarFallback className="text-lg">
              {student.profile.firstName[0]}
              {student.profile.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {student.profile.firstName} {student.profile.lastName}
            </h1>
            <p className="text-muted-foreground">Student Profile</p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/dashboard/students/${student.id}/edit`)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">First Name</label>
                <p className="font-medium">{student.profile.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                <p className="font-medium">{student.profile.lastName}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p className="font-medium capitalize">{student.profile.gender || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                <p className="font-medium">
                  {student.profile.dateOfBirth
                    ? new Date(student.profile.dateOfBirth).toLocaleDateString()
                    : "Not provided"}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant={student.isActive ? "default" : "secondary"}>
                  {student.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="font-medium">{student.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="font-medium">{student.profile.phone || "Not provided"}</p>
            </div>
            {student.profile.address && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="font-medium">
                  {student.profile.address.street && (
                    <>
                      {student.profile.address.street}
                      <br />
                    </>
                  )}
                  {student.profile.address.city && student.profile.address.state && (
                    <>
                      {student.profile.address.city}, {student.profile.address.state} {student.profile.address.zipCode}
                      <br />
                    </>
                  )}
                  {student.profile.address.country}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="font-medium">
                {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "Unknown"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="font-medium">
                {student.updatedAt ? new Date(student.updatedAt).toLocaleDateString() : "Unknown"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <p className="font-medium capitalize">{student.role}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
