"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/context"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PermissionGuard } from "@/components/permissions/permission-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, School, Globe, Save, Loader2, AlertCircle } from "lucide-react"

interface SchoolSettings {
  name: string
  address: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  phone: string
  email: string
  website?: string
  logo?: string
  academicYear: string
  currency: string
  timezone: string
  language: string
  features: {
    attendance: boolean
    examinations: boolean
    library: boolean
    transport: boolean
    hostel: boolean
    accounting: boolean
    messaging: boolean
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
  }
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<SchoolSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.schoolId) {
        setError("No school ID found. Please contact support.")
        setLoading(false)
        return
      }

      try {
        const schoolDoc = await getDoc(doc(db, "schools", user.schoolId))
        if (schoolDoc.exists()) {
          const data = schoolDoc.data()
          setSettings({
            name: data.name || "",
            address: data.address || {
              street: "",
              city: "",
              state: "",
              country: "",
              zipCode: "",
            },
            phone: data.phone || "",
            email: data.email || "",
            website: data.website || "",
            logo: data.logo || "",
            academicYear: data.settings?.academicYear || new Date().getFullYear().toString(),
            currency: data.settings?.currency || "USD",
            timezone: data.settings?.timezone || "UTC",
            language: data.settings?.language || "en",
            features: data.settings?.features || {
              attendance: true,
              examinations: true,
              library: false,
              transport: false,
              hostel: false,
              accounting: false,
              messaging: true,
            },
            notifications: data.settings?.notifications || {
              emailNotifications: true,
              smsNotifications: false,
              pushNotifications: true,
            },
          })
        } else {
          const defaultSettings: SchoolSettings = {
            name: `${user.profile?.firstName || "My"} School`,
            address: {
              street: "",
              city: "",
              state: "",
              country: "",
              zipCode: "",
            },
            phone: "",
            email: user.email || "",
            website: "",
            logo: "",
            academicYear: new Date().getFullYear().toString(),
            currency: "USD",
            timezone: "UTC",
            language: "en",
            features: {
              attendance: true,
              examinations: true,
              library: false,
              transport: false,
              hostel: false,
              accounting: false,
              messaging: true,
            },
            notifications: {
              emailNotifications: true,
              smsNotifications: false,
              pushNotifications: true,
            },
          }
          setSettings(defaultSettings)
        }
      } catch (error: any) {
        console.error("Error fetching settings:", error)
        setError(error.message || "Failed to load settings")
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [user?.schoolId, user?.profile?.firstName, user?.email])

  const handleSave = async () => {
    if (!user?.schoolId || !settings) return

    setSaving(true)
    setSuccess(false)
    setError(null)

    try {
      await updateDoc(doc(db, "schools", user.schoolId), {
        name: settings.name,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        website: settings.website,
        logo: settings.logo,
        settings: {
          academicYear: settings.academicYear,
          currency: settings.currency,
          timezone: settings.timezone,
          language: settings.language,
          features: settings.features,
          notifications: settings.notifications,
        },
        updatedAt: new Date(),
      })

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error: any) {
      console.error("Error saving settings:", error)
      setError(error.message || "Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const updateSetting = (path: string, value: any) => {
    if (!settings) return

    const keys = path.split(".")
    const newSettings = { ...settings }
    let current: any = newSettings

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    setSettings(newSettings)
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Settings" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading settings...</div>
        </div>
      </div>
    )
  }

  return (
    <PermissionGuard
      module="settings"
      action="view"
      fallback={
        <Alert>
          <AlertDescription>You don't have permission to view settings.</AlertDescription>
        </Alert>
      }
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Settings" }]} />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">School Settings</h2>
              <p className="text-muted-foreground">Configure your school's information and preferences</p>
            </div>
            <PermissionGuard module="settings" action="edit">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </PermissionGuard>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">Settings saved successfully!</AlertDescription>
            </Alert>
          )}

          {settings && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* School Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    School Information
                  </CardTitle>
                  <CardDescription>Basic information about your school</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schoolName">School Name *</Label>
                      <Input
                        id="schoolName"
                        value={settings.name}
                        onChange={(e) => updateSetting("name", e.target.value)}
                        placeholder="Your School Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="academicYear">Academic Year</Label>
                      <Select
                        value={settings.academicYear}
                        onValueChange={(value) => updateSetting("academicYear", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2026">2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={settings.phone}
                        onChange={(e) => updateSetting("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => updateSetting("email", e.target.value)}
                        placeholder="info@yourschool.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      value={settings.website}
                      onChange={(e) => updateSetting("website", e.target.value)}
                      placeholder="https://yourschool.com"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Address</h3>
                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={settings.address.street}
                        onChange={(e) => updateSetting("address.street", e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={settings.address.city}
                          onChange={(e) => updateSetting("address.city", e.target.value)}
                          placeholder="Springfield"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          value={settings.address.state}
                          onChange={(e) => updateSetting("address.state", e.target.value)}
                          placeholder="Illinois"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={settings.address.country}
                          onChange={(e) => updateSetting("address.country", e.target.value)}
                          placeholder="United States"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                        <Input
                          id="zipCode"
                          value={settings.address.zipCode}
                          onChange={(e) => updateSetting("address.zipCode", e.target.value)}
                          placeholder="62701"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    System Preferences
                  </CardTitle>
                  <CardDescription>Configure system-wide settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="NGN">NGN (₦)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Africa/Lagos">West Africa Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Feature Toggles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Features
                  </CardTitle>
                  <CardDescription>Enable or disable features for your school</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(settings.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="capitalize">{feature.replace(/([A-Z])/g, " $1").trim()}</Label>
                        <p className="text-xs text-muted-foreground">
                          {feature === "attendance" && "Track student and staff attendance"}
                          {feature === "examinations" && "Manage exams and assessments"}
                          {feature === "library" && "Library management system"}
                          {feature === "transport" && "School bus and transport management"}
                          {feature === "hostel" && "Hostel and accommodation management"}
                          {feature === "accounting" && "Financial accounting and bookkeeping"}
                          {feature === "messaging" && "Internal messaging system"}
                        </p>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => updateSetting(`features.${feature}`, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PermissionGuard>
  )
}
