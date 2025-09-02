"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/context"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BulkImport } from "@/components/import/bulk-import"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Upload, Users, GraduationCap, UserCheck } from "lucide-react"

export default function ImportPage() {
  const { user } = useAuth()
  const [importHistory, setImportHistory] = useState<any[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleImport = async (data: any[], type: string) => {
    if (!user?.schoolId) {
      setError("No school ID found. Please contact support.")
      return
    }

    try {
      const batch = []
      for (const item of data) {
        const userData = {
          ...item,
          schoolId: user.schoolId,
          role: type.slice(0, -1), // Remove 's' from type (students -> student)
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
        batch.push(addDoc(collection(db, "users"), userData))
      }

      await Promise.all(batch)

      // Add to import history
      const importRecord = {
        id: Date.now(),
        type,
        count: data.length,
        timestamp: new Date(),
        status: "completed",
      }

      setImportHistory((prev) => [importRecord, ...prev])
      setSuccess(`Successfully imported ${data.length} ${type}!`)

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000)
    } catch (error) {
      console.error("Import failed:", error)
      setError("Failed to import data. Please try again.")
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "students":
        return <GraduationCap className="h-4 w-4" />
      case "teachers":
        return <Users className="h-4 w-4" />
      case "parents":
        return <UserCheck className="h-4 w-4" />
      default:
        return <Upload className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Bulk Import" }]} />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Import</h1>
          <p className="text-muted-foreground">Import users and other data in bulk using CSV files</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BulkImport onImport={handleImport} onError={setError} />
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Import History</CardTitle>
              </CardHeader>
              <CardContent>
                {importHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No imports yet</p>
                ) : (
                  <div className="space-y-3">
                    {importHistory.slice(0, 10).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(record.type)}
                          <div>
                            <p className="text-sm font-medium">
                              {record.count} {record.type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {record.timestamp.toLocaleDateString()} at {record.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">{record.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
