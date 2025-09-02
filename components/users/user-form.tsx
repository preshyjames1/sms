"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProfilePictureUpload } from "@/components/upload/profile-picture-upload"
import { Loader2, ArrowLeft } from "lucide-react"
import type { User, UserRole } from "@/lib/types"
import Link from "next/link"

interface UserFormProps {
  user?: User
  userType: "students" | "teachers" | "parents" | "staff"
  onSubmit: (userData: Partial<User>) => Promise<void>
  isLoading?: boolean
}

export function UserForm({ user, userType, onSubmit, isLoading = false }: UserFormProps) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || "",
    lastName: user?.profile?.lastName || "",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    dateOfBirth: user?.profile?.dateOfBirth ? new Date(user.profile.dateOfBirth).toISOString().split("T")[0] : "",
    gender: user?.profile?.gender || "",
    avatar: user?.profile?.avatar || "",
    avatarPath: user?.profile?.avatarPath || "",
    address: {
      street: user?.profile?.address?.street || "",
      city: user?.profile?.address?.city || "",
      state: user?.profile?.address?.state || "",
      country: user?.profile?.address?.country || "",
      zipCode: user?.profile?.address?.zipCode || "",
    },
    role: user?.role || getRoleFromUserType(userType),
    isActive: user?.isActive ?? true,
  })

  function getRoleFromUserType(type: string): UserRole {
    switch (type) {
      case "students":
        return "student"
      case "teachers":
        return "teacher"
      case "parents":
        return "parent"
      case "staff":
        return "teacher" // Default staff role
      default:
        return "student"
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleImageUpdate = (url: string, path: string) => {
    setFormData((prev) => ({
      ...prev,
      avatar: url,
      avatarPath: path,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const userData: Partial<User> = {
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
          gender: formData.gender as "male" | "female" | "other" | undefined,
          avatar: formData.avatar,
          avatarPath: formData.avatarPath,
          address: formData.address,
        },
      }

      await onSubmit(userData)
    } catch (error: any) {
      setError(error.message || "Failed to save user")
    }
  }

  const isEditing = !!user

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/${userType}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? "Edit" : "Add New"} {userType.slice(0, -1)}
          </h1>
          <p className="text-muted-foreground">{isEditing ? "Update user information" : "Create a new user account"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details about the user</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProfilePictureUpload
              currentImage={formData.avatar}
              currentImagePath={formData.avatarPath}
              onImageUpdate={handleImageUpdate}
              onError={setError}
              userName={`${formData.firstName} ${formData.lastName}`.trim() || "User"}
              className="max-w-sm"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
            <CardDescription>Contact address details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) => handleInputChange("address.street", e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange("address.city", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange("address.state", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.address.country}
                  onChange={(e) => handleInputChange("address.country", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>User role and account status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value as UserRole)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="librarian">Librarian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.isActive ? "active" : "inactive"}
                  onValueChange={(value) => handleInputChange("isActive", value === "active")}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{isEditing ? "Update User" : "Create User"}</>
            )}
          </Button>
          <Link href={`/dashboard/${userType}`}>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
