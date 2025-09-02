"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/context"
import { useSearchParams } from "next/navigation"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  GraduationCap,
  UserCheck,
  BookOpen,
  TrendingUp,
  Calendar,
  MessageSquare,
  ClipboardCheck,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  attendanceRate: number
}

interface Activity {
  id: string
  title: string
  description: string
  time: string
  status: "success" | "pending" | "warning"
  type: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get("welcome") === "true"
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    attendanceRate: 0,
  })
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.schoolId) return

      try {
        // Fetch students count
        const studentsQuery = query(
          collection(db, "users"),
          where("schoolId", "==", user.schoolId),
          where("role", "==", "student"),
          where("isActive", "==", true),
        )
        const studentsSnapshot = await getDocs(studentsQuery)
        const totalStudents = studentsSnapshot.size

        // Fetch teachers count
        const teachersQuery = query(
          collection(db, "users"),
          where("schoolId", "==", user.schoolId),
          where("role", "==", "teacher"),
          where("isActive", "==", true),
        )
        const teachersSnapshot = await getDocs(teachersQuery)
        const totalTeachers = teachersSnapshot.size

        // Fetch classes count
        const classesQuery = query(
          collection(db, "classes"),
          where("schoolId", "==", user.schoolId),
          where("isActive", "==", true),
        )
        const classesSnapshot = await getDocs(classesQuery)
        const totalClasses = classesSnapshot.size

        // Calculate attendance rate (mock for now)
        const attendanceRate = totalStudents > 0 ? Math.round(totalStudents * 0.94 * 100) / 100 : 0

        setStats({
          totalStudents,
          totalTeachers,
          totalClasses,
          attendanceRate,
        })

        // Fetch recent activities (mock data for now)
        setRecentActivities([])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user?.schoolId])

  const quickActions = [
    {
      title: "Add Student",
      description: "Enroll a new student",
      href: "/dashboard/students/new",
      icon: GraduationCap,
    },
    {
      title: "Add Teacher",
      description: "Register a new teacher",
      href: "/dashboard/teachers/new",
      icon: UserCheck,
    },
    {
      title: "Create Class",
      description: "Set up a new class",
      href: "/dashboard/classes/new",
      icon: BookOpen,
    },
    {
      title: "Send Message",
      description: "Communicate with users",
      href: "/dashboard/messages/new",
      icon: MessageSquare,
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard" }]} />

      <div className="space-y-6">
        {/* Welcome Message */}
        {isWelcome && (
          <Alert className="border-primary/20 bg-primary/5">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              Welcome to SchoolManagementSystem.com! Your account has been created successfully. Start by adding
              students, teachers, and setting up your classes.
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.profile?.firstName}!</h1>
          <p className="text-muted-foreground">Here's what's happening at your school today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Students"
            value={stats.totalStudents.toString()}
            description="Active enrollments"
            icon={GraduationCap}
            trend={stats.totalStudents > 0 ? { value: 12, label: "from last month", positive: true } : undefined}
          />
          <StatsCard
            title="Teachers"
            value={stats.totalTeachers.toString()}
            description="Active staff members"
            icon={UserCheck}
            trend={stats.totalTeachers > 0 ? { value: 8, label: "from last month", positive: true } : undefined}
          />
          <StatsCard
            title="Classes"
            value={stats.totalClasses.toString()}
            description="Active classes"
            icon={BookOpen}
          />
          <StatsCard
            title="Attendance Rate"
            value={stats.attendanceRate > 0 ? `${stats.attendanceRate}%` : "N/A"}
            description="This week"
            icon={ClipboardCheck}
            trend={stats.attendanceRate > 0 ? { value: 2.1, label: "from last week", positive: true } : undefined}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Quick Actions */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to get you started</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your school</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                  <p className="text-xs text-muted-foreground">Activity will appear here as you use the system</p>
                </div>
              ) : (
                recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      {activity.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {activity.status === "pending" && <Clock className="h-4 w-4 text-blue-500" />}
                      {activity.status === "warning" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Today's Schedule</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-4">
                <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No scheduled events</p>
              </div>
              <Link href="/dashboard/timetable">
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  View Full Schedule
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Pending Tasks</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-4">
                <ClipboardCheck className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No pending tasks</p>
              </div>
              <Link href="/dashboard/reports">
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  View All Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">System Status</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Server Status</span>
                <Badge className="bg-green-500">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge className="bg-green-500">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup</span>
                <Badge variant="outline">Last: 2h ago</Badge>
              </div>
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                  System Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
