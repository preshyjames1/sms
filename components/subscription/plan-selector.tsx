"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CheckCircle, Crown, Zap, Star } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription/plans"

interface PlanSelectorProps {
  currentPlan?: string
  onSelectPlan: (planId: string, billingCycle: "monthly" | "yearly") => void
  className?: string
}

export function PlanSelector({ currentPlan = "free", onSelectPlan, className = "" }: PlanSelectorProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Crown":
        return Crown
      case "Zap":
        return Zap
      default:
        return CheckCircle
    }
  }

  const getYearlySavings = (monthly: number, yearly: number) => {
    if (monthly === 0) return 0
    const monthlyCost = monthly * 12
    return Math.round(((monthlyCost - yearly) / monthlyCost) * 100)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground">Select the perfect plan for your school's needs</p>

        <div className="flex items-center justify-center gap-4">
          <Label htmlFor="billing-toggle">Monthly</Label>
          <Switch
            id="billing-toggle"
            checked={billingCycle === "yearly"}
            onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
          />
          <Label htmlFor="billing-toggle" className="flex items-center gap-2">
            Yearly
            <Badge variant="secondary" className="text-xs">
              Save up to 17%
            </Badge>
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
          const Icon = getIcon(plan.icon)
          const price = plan.price[billingCycle]
          const isCurrentPlan = currentPlan === plan.id
          const savings = getYearlySavings(plan.price.monthly, plan.price.yearly)

          return (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""} ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div
                  className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center text-white ${plan.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>

                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    ${price}
                    {price > 0 && (
                      <span className="text-lg font-normal text-muted-foreground">
                        /{billingCycle === "yearly" ? "year" : "month"}
                      </span>
                    )}
                  </div>
                  {billingCycle === "yearly" && savings > 0 && (
                    <div className="text-sm text-green-600">Save {savings}% annually</div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`h-4 w-4 ${feature.included ? "text-green-500" : "text-gray-300"}`} />
                      <span className={feature.included ? "" : "text-muted-foreground line-through"}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                  {plan.features.length > 6 && (
                    <div className="text-xs text-muted-foreground">+{plan.features.length - 6} more features</div>
                  )}
                </div>

                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "secondary" : plan.popular ? "default" : "outline"}
                  onClick={() => onSelectPlan(plan.id, billingCycle)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? "Current Plan" : plan.id === "free" ? "Get Started" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
