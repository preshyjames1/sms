"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Users, Shield, Info } from "lucide-react"
import { ROLE_TEMPLATES } from "@/lib/permissions"
import type { CustomRole, Permission, PermissionModule, PermissionAction } from "@/lib/types"
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

const PERMISSION_MODULES: { module: PermissionModule; label: string; description: string }[] = [
  { module: "dashboard", label: "Dashboard", description: "Main dashboard and overview" },
  { module: "students", label: "Students", description: "Student management and profiles" },
  { module: "teachers", label: "Teachers", description: "Teacher management and profiles" },
  { module: "parents", label: "Parents", description: "Parent management and communication" },
  { module: "staff", label: "Staff", description: "Staff management and profiles" },
  { module: "classes", label: "Classes", description: "Class management and organization" },
  { module: "subjects", label: "Subjects", description: "Subject management and curriculum" },
  { module: "timetable", label: "Timetable", description: "Schedule and timetable management" },
  { module: "attendance", label: "Attendance", description: "Attendance tracking and reports" },
  { module: "examinations", label: "Examinations", description: "Exam management and scheduling" },
  { module: "grades", label: "Grades", description: "Grade management and report cards" },
  { module: "library", label: "Library", description: "Library management and book tracking" },
  { module: "transport", label: "Transport", description: "Transportation and bus management" },
  { module: "hostel", label: "Hostel", description: "Hostel management and accommodation" },
  { module: "accounting", label: "Accounting", description: "Financial accounting and bookkeeping" },
  { module: "fees", label: "Fees", description: "Fee management and payment tracking" },
  { module: "payroll", label: "Payroll", description: "Staff payroll and salary management" },
  { module: "inventory", label: "Inventory", description: "Inventory and asset management" },
  { module: "messages", label: "Messages", description: "Internal messaging system" },
  { module: "announcements", label: "Announcements", description: "School announcements and notices" },
  { module: "reports", label: "Reports", description: "Various reports and analytics" },
  { module: "analytics", label: "Analytics", description: "Data analytics and insights" },
  { module: "settings", label: "Settings", description: "School settings and configuration" },
  { module: "billing", label: "Billing", description: "Subscription and billing management" },
  { module: "users", label: "Users", description: "User account management" },
  { module: "roles", label: "Roles", description: "Role and permission management" },
]

const PERMISSION_ACTIONS: { action: PermissionAction; label: string; description: string }[] = [
  { action: "view", label: "View", description: "Can view and read data" },
  { action: "create", label: "Create", description: "Can create new records" },
  { action: "edit", label: "Edit", description: "Can modify existing records" },
  { action: "delete", label: "Delete", description: "Can delete records" },
  { action: "export", label: "Export", description: "Can export data to files" },
  { action: "import", label: "Import", description: "Can import data from files" },
]

export function RoleManagement() {
  const { user } = useAuth()
  const [customRoles, setCustomRoles] = useState<CustomRole[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<CustomRole | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as Permission[],
  })

  useEffect(() => {
    const fetchRoles = async () => {
      if (!user?.schoolId) return

      try {
        const rolesQuery = query(collection(db, "customRoles"), where("schoolId", "==", user.schoolId))
        const rolesSnapshot = await getDocs(rolesQuery)
        const rolesData = rolesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CustomRole[]

        setCustomRoles(rolesData)
      } catch (error) {
        console.error("Error fetching roles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoles()
  }, [user?.schoolId])

  const handleCreateRole = async () => {
    if (!user?.schoolId || !formData.name) return

    try {
      if (editingRole) {
        await updateDoc(doc(db, "customRoles", editingRole.id), {
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
          updatedAt: new Date(),
        })

        setCustomRoles((prev) =>
          prev.map((role) => (role.id === editingRole.id ? { ...role, ...formData, updatedAt: new Date() } : role)),
        )
      } else {
        const roleData = {
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions,
          schoolId: user.schoolId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const docRef = await addDoc(collection(db, "customRoles"), roleData)
        setCustomRoles((prev) => [...prev, { id: docRef.id, ...roleData }])
      }

      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Error saving role:", error)
    }
  }

  const handleEditRole = (role: CustomRole) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    })
    setIsCreateDialogOpen(true)
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return

    try {
      await deleteDoc(doc(db, "customRoles", roleId))
      setCustomRoles((prev) => prev.filter((role) => role.id !== roleId))
    } catch (error) {
      console.error("Error deleting role:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      permissions: [],
    })
    setEditingRole(null)
    setSelectedTemplate("")
  }

  const handleTemplateSelect = (templateName: string) => {
    const template = ROLE_TEMPLATES.find((t) => t.name === templateName)
    if (template) {
      setFormData({
        name: template.name,
        description: template.description,
        permissions: template.permissions,
      })
    }
  }

  const handlePermissionChange = (module: PermissionModule, actions: PermissionAction[]) => {
    const updatedPermissions = formData.permissions.filter((p) => p.module !== module)
    if (actions.length > 0) {
      updatedPermissions.push({ module, actions })
    }
    setFormData({ ...formData, permissions: updatedPermissions })
  }

  const getModuleActions = (module: PermissionModule): PermissionAction[] => {
    const permission = formData.permissions.find((p) => p.module === module)
    return permission?.actions || []
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading roles...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Role Management</h2>
          <p className="text-muted-foreground">Create and manage custom roles with specific permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Create Custom Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRole ? "Edit Role" : "Create Custom Role"}</DialogTitle>
              <DialogDescription>
                Define a custom role with specific permissions for your school staff
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Template Selection */}
              <div className="space-y-2">
                <Label>Start from Template (Optional)</Label>
                <Select
                  value={selectedTemplate}
                  onValueChange={(value) => {
                    setSelectedTemplate(value)
                    handleTemplateSelect(value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a role template" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_TEMPLATES.map((template) => (
                      <SelectItem key={template.name} value={template.name}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roleName">Role Name *</Label>
                  <Input
                    id="roleName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Academic Coordinator"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roleDescription">Description</Label>
                  <Textarea
                    id="roleDescription"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this role's responsibilities"
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Permissions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Permissions</h3>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Select the modules and actions this role should have access to. Users with this role will only be
                    able to perform the selected actions.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4">
                  {PERMISSION_MODULES.map((moduleInfo) => {
                    const currentActions = getModuleActions(moduleInfo.module)

                    return (
                      <Card key={moduleInfo.module}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-sm">{moduleInfo.label}</CardTitle>
                              <CardDescription className="text-xs">{moduleInfo.description}</CardDescription>
                            </div>
                            <Badge variant={currentActions.length > 0 ? "default" : "secondary"}>
                              {currentActions.length} permissions
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-3 gap-2">
                            {PERMISSION_ACTIONS.map((actionInfo) => (
                              <div key={actionInfo.action} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${moduleInfo.module}-${actionInfo.action}`}
                                  checked={currentActions.includes(actionInfo.action)}
                                  onCheckedChange={(checked) => {
                                    const newActions = checked
                                      ? [...currentActions, actionInfo.action]
                                      : currentActions.filter((a) => a !== actionInfo.action)
                                    handlePermissionChange(moduleInfo.module, newActions)
                                  }}
                                />
                                <Label
                                  htmlFor={`${moduleInfo.module}-${actionInfo.action}`}
                                  className="text-xs font-normal cursor-pointer"
                                >
                                  {actionInfo.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRole} disabled={!formData.name}>
                  {editingRole ? "Update Role" : "Create Role"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing Custom Roles */}
      <div className="grid gap-4">
        {customRoles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Custom Roles Yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create custom roles to give specific permissions to your staff members
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Role
              </Button>
            </CardContent>
          </Card>
        ) : (
          customRoles.map((role) => (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {role.name}
                    </CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{role.permissions.length} modules</Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteRole(role.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <Badge key={permission.module} variant="outline">
                      {PERMISSION_MODULES.find((m) => m.module === permission.module)?.label}:{" "}
                      {permission.actions.join(", ")}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
