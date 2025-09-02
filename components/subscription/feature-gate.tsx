"use client"

import type React from "react"

import { useAuth } from "@/lib/auth/context"
import { checkFeatureAccess } from "@/lib/subscription/plans"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Crown, Zap } from "lucide-react"

interface FeatureGateProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
  showUpgrade?: boolean
}

export function FeatureGate({ feature, children, fallback, showUpgrade = true }: FeatureGateProps) {
  const { user, schoolData } = useAuth()

  if (!user || !schoolData) {
    return null
  }

  const hasAccess = checkFeatureAccess(schoolData.subscription || "free", feature)

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (!showUpgrade) {
    return null
  }

  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          Premium Feature
          <Badge variant="secondary">
            <Crown className="h-3 w-3 mr-1" />
            Upgrade Required
          </Badge>
        </CardTitle>
        <CardDescription>This feature requires a higher subscription plan to access.</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button className="w-full">
          <Zap className="h-4 w-4 mr-2" />
          Upgrade Plan
        </Button>
      </CardContent>
    </Card>
  )
}
