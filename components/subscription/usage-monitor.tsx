"use client"

import { useAuth } from "@/lib/auth/context"
import { checkLimitUsage, getPlanLimits } from "@/lib/subscription/plans"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp } from "lucide-react"

interface UsageMonitorProps {
  usage: {
    students: number
    teachers: number
    storage: number
    classes: number
    subjects: number
    apiCalls: number
    emailNotifications: number
    customRoles: number
    bulkImports: number
  }
  className?: string
}

export function UsageMonitor({ usage, className = "" }: UsageMonitorProps) {
  const { schoolData } = useAuth()

  if (!schoolData) return null

  const planId = schoolData.subscription || "free"
  const limits = getPlanLimits(planId)

  const usageItems = [
    { key: "students", label: "Students", value: usage.students, icon: "👨‍🎓" },
    { key: "teachers", label: "Teachers", value: usage.teachers, icon: "👨‍🏫" },
    { key: "storage", label: "Storage (GB)", value: usage.storage, icon: "💾" },
    { key: "classes", label: "Classes", value: usage.classes, icon: "🏫" },
    { key: "subjects", label: "Subjects", value: usage.subjects, icon: "📚" },
    { key: "customRoles", label: "Custom Roles", value: usage.customRoles, icon: "👤" },
  ]

  const criticalUsage = usageItems.filter((item) => {
    const check = checkLimitUsage(planId, item.key as any, item.value)
    return check.percentage > 80 && check.limit !== "unlimited"
  })

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Usage & Limits
          <Badge variant="outline">{planId.charAt(0).toUpperCase() + planId.slice(1)} Plan</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {criticalUsage.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You're approaching limits for: {criticalUsage.map((item) => item.label).join(", ")}
              <Button variant="link" className="p-0 h-auto ml-2">
                Upgrade Plan
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4">
          {usageItems.map((item) => {
            const check = checkLimitUsage(planId, item.key as any, item.value)
            const isUnlimited = check.limit === "unlimited"

            return (
              <div key={item.key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="font-medium">
                    {item.value} / {isUnlimited ? "∞" : check.limit}
                  </span>
                </div>
                {!isUnlimited && (
                  <div className="space-y-1">
                    <Progress
                      value={check.percentage}
                      className={`h-2 ${check.percentage > 90 ? "bg-red-100" : check.percentage > 80 ? "bg-yellow-100" : ""}`}
                    />
                    {check.percentage > 80 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        {check.percentage.toFixed(0)}% used
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full bg-transparent">
            View Detailed Usage
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
