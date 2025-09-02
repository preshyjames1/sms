"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  School,
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronUp,
  UserCheck,
  Building,
  CreditCard,
  Shield,
  Upload,
} from "lucide-react"

const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Role Management",
    items: [
      {
        title: "Roles & Permissions",
        url: "/dashboard/roles",
        icon: Shield,
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "Students",
        url: "/dashboard/students",
        icon: GraduationCap,
      },
      {
        title: "Teachers",
        url: "/dashboard/teachers",
        icon: UserCheck,
      },
      {
        title: "Parents",
        url: "/dashboard/parents",
        icon: Users,
      },
      {
        title: "Staff",
        url: "/dashboard/staff",
        icon: Building,
      },
      {
        title: "Bulk Import",
        url: "/dashboard/import",
        icon: Upload,
      },
    ],
  },
  {
    title: "Academic",
    items: [
      {
        title: "Classes",
        url: "/dashboard/classes",
        icon: BookOpen,
      },
      {
        title: "Subjects",
        url: "/dashboard/subjects",
        icon: FileText,
      },
      {
        title: "Timetable",
        url: "/dashboard/timetable",
        icon: Calendar,
      },
      {
        title: "Attendance",
        url: "/dashboard/attendance",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        title: "Messages",
        url: "/dashboard/messages",
        icon: MessageSquare,
      },
      {
        title: "Announcements",
        url: "/dashboard/announcements",
        icon: FileText,
      },
    ],
  },
  {
    title: "Reports & Analytics",
    items: [
      {
        title: "Reports",
        url: "/dashboard/reports",
        icon: BarChart3,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
      },
    ],
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [schoolName, setSchoolName] = useState<string>("Loading...")

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

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <School className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-sm">{schoolName}</span>
            <span className="text-xs text-muted-foreground">School Portal</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"} tooltip="Settings">
                  <Link href="/dashboard/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/billing"} tooltip="Billing">
                  <Link href="/dashboard/billing">
                    <CreditCard />
                    <span>Billing</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/placeholder.svg" alt={user?.profile?.firstName} />
                    <AvatarFallback className="rounded-lg">
                      {user?.profile?.firstName?.[0]}
                      {user?.profile?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.profile?.firstName} {user?.profile?.lastName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/placeholder.svg" alt={user?.profile?.firstName} />
                      <AvatarFallback className="rounded-lg">
                        {user?.profile?.firstName?.[0]}
                        {user?.profile?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.profile?.firstName} {user?.profile?.lastName}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <Users className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
