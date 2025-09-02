"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AnalyticsDashboard } from "@/components/reports/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Analytics" }]} />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Comprehensive analytics and insights for your school</p>
        </div>

        <AnalyticsDashboard />
      </div>
    </div>
  )
}
