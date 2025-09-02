"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, X } from "lucide-react"
import type { Class } from "@/lib/types/academic"
import Link from "next/link"

interface ClassFormProps {
  classData?: Class
  onSubmit: (classData: Partial<Class>) => Promise<void>
  isLoading?: boolean
}

export function ClassForm({ classData, onSubmit, isLoading = false }: ClassFormProps) {
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: classData?.name || "",
    section: classData?.section || "",
    grade: classData?.grade || "",
    capacity: classData?.capacity || 30,
    room: classData?.room || "",
    description: classData?.description || "",
    academicYear: classData?.academicYear || new Date().getFullYear().toString(),
    subjects: classData?.subjects || [],
    isActive: classData?.isActive ?? true,
  })
  const [newSubject, setNewSubject] = useState("")

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()],
      }))
      setNewSubject("")
    }
  }

  const removeSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s !== subject),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const classDataToSubmit: Partial<Class> = {
        name: formData.name,
        section: formData.section,
        grade: formData.grade,
        capacity: formData.capacity,
        room: formData.room,
        description: formData.description,
        academicYear: formData.academicYear,
        subjects: formData.subjects,
        isActive: formData.isActive,
      }

      await onSubmit(classDataToSubmit)
    } catch (error: any) {
      setError(error.message || "Failed to save class")
    }
  }

  const isEditing = !!classData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/classes">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isEditing ? "Edit" : "Add New"} Class</h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update class information" : "Create a new class for your school"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Essential details about the class</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Mathematics"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section *</Label>
                <Input
                  id="section"
                  value={formData.section}
                  onChange={(e) => handleInputChange("section", e.target.value)}
                  placeholder="e.g., A, B, C"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value) => handleInputChange("grade", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", Number.parseInt(e.target.value) || 0)}
                  min="1"
                  max="100"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => handleInputChange("room", e.target.value)}
                  placeholder="e.g., Room 101"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Select
                  value={formData.academicYear}
                  onValueChange={(value) => handleInputChange("academicYear", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}-{year + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Optional description about the class"
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Subjects */}
        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
            <CardDescription>Subjects taught in this class</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add a subject"
                disabled={isLoading}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSubject()
                  }
                }}
              />
              <Button type="button" onClick={addSubject} disabled={isLoading || !newSubject.trim()}>
                Add
              </Button>
            </div>

            {formData.subjects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.subjects.map((subject) => (
                  <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                    {subject}
                    <button
                      type="button"
                      onClick={() => removeSubject(subject)}
                      className="ml-1 hover:text-destructive"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Class status and configuration</CardDescription>
          </CardHeader>
          <CardContent>
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
              <>{isEditing ? "Update Class" : "Create Class"}</>
            )}
          </Button>
          <Link href="/dashboard/classes">
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
