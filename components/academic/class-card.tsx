"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, BookOpen, MapPin, MoreHorizontal, Edit, Eye, Trash2, UserCheck } from "lucide-react"
import type { Class } from "@/lib/types/academic"
import Link from "next/link"

interface ClassCardProps {
  classData: Class
  teacherName?: string
  studentCount?: number
  onEdit?: (classData: Class) => void
  onDelete?: (classData: Class) => void
  onView?: (classData: Class) => void
}

export function ClassCard({ classData, teacherName, studentCount = 0, onEdit, onDelete, onView }: ClassCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {classData.name} - {classData.section}
            </CardTitle>
            <CardDescription>
              Grade {classData.grade} • {classData.academicYear}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView?.(classData)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(classData)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Class
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete?.(classData)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Class Teacher */}
        {teacherName && (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                <UserCheck className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Class Teacher</p>
              <p className="text-xs text-muted-foreground">{teacherName}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">{studentCount}</p>
            <p className="text-xs text-muted-foreground">Students</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">{classData.subjects.length}</p>
            <p className="text-xs text-muted-foreground">Subjects</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">{classData.room || "TBA"}</p>
            <p className="text-xs text-muted-foreground">Room</p>
          </div>
        </div>

        {/* Status and Capacity */}
        <div className="flex items-center justify-between">
          <Badge variant={classData.isActive ? "default" : "secondary"}>
            {classData.isActive ? "Active" : "Inactive"}
          </Badge>
          <span className="text-xs text-muted-foreground">Capacity: {classData.capacity}</span>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Link href={`/dashboard/attendance?class=${classData.id}`}>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              Attendance
            </Button>
          </Link>
          <Link href={`/dashboard/timetable?class=${classData.id}`}>
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              Timetable
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
