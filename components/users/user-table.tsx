"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, MoreHorizontal, Edit, Eye, Trash2, UserPlus } from "lucide-react"
import type { User } from "@/lib/types"
import Link from "next/link"

interface UserTableProps {
  users: User[]
  userType: "students" | "teachers" | "parents" | "staff"
  onEdit?: (user: User) => void
  onDelete?: (user: User) => void
  onView?: (user: User) => void
}

export function UserTable({ users, userType, onEdit, onDelete, onView }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.profile.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profile.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive)

    return matchesSearch && matchesStatus
  })

  const getUserTypeLabel = (type: string) => {
    const labels = {
      students: "Students",
      teachers: "Teachers",
      parents: "Parents",
      staff: "Staff",
    }
    return labels[type as keyof typeof labels] || "Users"
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "school_admin":
        return "default"
      case "teacher":
        return "secondary"
      case "student":
        return "outline"
      case "parent":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{getUserTypeLabel(userType)}</h2>
          <p className="text-muted-foreground">Manage your school's {userType.toLowerCase()}</p>
        </div>
        <Link href={`/dashboard/${userType}/new`}>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add {userType.slice(0, -1)}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${userType}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("active")}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("inactive")}
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {searchTerm || statusFilter !== "all"
                        ? `No ${userType} found matching your criteria.`
                        : `No ${userType} found. Add your first ${userType.slice(0, -1)} to get started.`}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profile.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {user.profile.firstName[0]}
                            {user.profile.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.profile.firstName} {user.profile.lastName}
                          </div>
                          {user.profile.phone && (
                            <div className="text-sm text-muted-foreground">{user.profile.phone}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
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
                          <DropdownMenuItem onClick={() => onView?.(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit?.(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDelete?.(user)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredUsers.length} of {users.length} {userType}
      </div>
    </div>
  )
}
