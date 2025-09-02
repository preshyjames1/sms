"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PermissionGuard } from "@/components/permissions/permission-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Download, Calendar, CheckCircle, AlertCircle, Crown, Zap } from "lucide-react"

interface BillingInfo {
  subscription: "free" | "basic" | "premium" | "enterprise"
  billingCycle: "monthly" | "yearly"
  nextBillingDate?: Date
  amount?: number
  currency: string
  paymentMethod?: {
    type: "card" | "bank"
    last4: string
    brand?: string
  }
  invoices: Invoice[]
}

interface Invoice {
  id: string
  date: Date
  amount: number
  status: "paid" | "pending" | "failed"
  downloadUrl?: string
}

const SUBSCRIPTION_PLANS = {
  free: {
    name: "Free Plan",
    price: 0,
    features: ["Up to 50 students", "Basic reporting", "Email support"],
    color: "bg-gray-500",
    icon: CheckCircle,
  },
  basic: {
    name: "Basic Plan",
    price: 29,
    features: ["Up to 200 students", "Advanced reporting", "Priority support", "Custom branding"],
    color: "bg-blue-500",
    icon: Zap,
  },
  premium: {
    name: "Premium Plan",
    price: 79,
    features: ["Up to 1000 students", "All features", "24/7 support", "API access", "Custom integrations"],
    color: "bg-purple-500",
    icon: Crown,
  },
  enterprise: {
    name: "Enterprise Plan",
    price: 199,
    features: ["Unlimited students", "White-label solution", "Dedicated support", "Custom development"],
    color: "bg-gold-500",
    icon: Crown,
  },
}

export default function BillingPage() {
  const { user } = useAuth()
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null)
  const [schoolData, setSchoolData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBillingInfo = async () => {
      if (!user?.schoolId) return

      try {
        // Fetch school data to get subscription info
        const schoolDoc = await getDoc(doc(db, "schools", user.schoolId))
        if (schoolDoc.exists()) {
          const data = schoolDoc.data()
          setSchoolData(data)

          // Mock billing info - replace with actual billing data
          setBillingInfo({
            subscription: data.subscription || "free",
            billingCycle: "monthly",
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            amount: SUBSCRIPTION_PLANS[data.subscription as keyof typeof SUBSCRIPTION_PLANS]?.price || 0,
            currency: "USD",
            paymentMethod:
              data.subscription !== "free"
                ? {
                    type: "card",
                    last4: "4242",
                    brand: "Visa",
                  }
                : undefined,
            invoices: [],
          })
        }
      } catch (error) {
        console.error("Error fetching billing info:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBillingInfo()
  }, [user?.schoolId])

  const currentPlan = billingInfo ? SUBSCRIPTION_PLANS[billingInfo.subscription] : null

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Billing" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading billing information...</div>
        </div>
      </div>
    )
  }

  return (
    <PermissionGuard
      module="billing"
      action="view"
      fallback={
        <Alert>
          <AlertDescription>You don't have permission to view billing information.</AlertDescription>
        </Alert>
      }
    >
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Billing" }]} />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Billing & Subscription</h2>
              <p className="text-muted-foreground">Manage your subscription and billing information</p>
            </div>
          </div>

          {/* Current Plan */}
          {currentPlan && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${currentPlan.color} text-white`}>
                      <currentPlan.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>{currentPlan.name}</CardTitle>
                      <CardDescription>
                        {billingInfo?.subscription === "free"
                          ? "Your current plan"
                          : `$${currentPlan.price}/${billingInfo?.billingCycle || "month"}`}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={billingInfo?.subscription === "free" ? "secondary" : "default"}>Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <h4 className="font-medium">Plan Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {billingInfo?.subscription !== "free" && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Next billing date:</span>
                        <div className="font-medium">{billingInfo?.nextBillingDate?.toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Amount:</span>
                        <div className="font-medium">
                          ${billingInfo?.amount}/{billingInfo?.billingCycle}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-2">
                  <Button variant="outline">
                    {billingInfo?.subscription === "free" ? "Upgrade Plan" : "Change Plan"}
                  </Button>
                  {billingInfo?.subscription !== "free" && (
                    <Button variant="outline">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Update Payment Method
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Method */}
          {billingInfo?.paymentMethod && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {billingInfo.paymentMethod.brand} ending in {billingInfo.paymentMethod.last4}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {billingInfo.paymentMethod.type === "card" ? "Credit Card" : "Bank Account"}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usage & Limits */}
          <Card>
            <CardHeader>
              <CardTitle>Usage & Limits</CardTitle>
              <CardDescription>Your current usage against plan limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Students</span>
                  <span>
                    0 /{" "}
                    {billingInfo?.subscription === "enterprise"
                      ? "Unlimited"
                      : billingInfo?.subscription === "premium"
                        ? "1,000"
                        : billingInfo?.subscription === "basic"
                          ? "200"
                          : "50"}
                  </span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Teachers</span>
                  <span>0 / Unlimited</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Storage Used</span>
                  <span>0 GB / {billingInfo?.subscription === "free" ? "1 GB" : "Unlimited"}</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Billing History
              </CardTitle>
              <CardDescription>Your recent invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              {billingInfo?.invoices.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Billing History</h3>
                  <p className="text-muted-foreground">
                    {billingInfo?.subscription === "free"
                      ? "You're on the free plan. Upgrade to see billing history."
                      : "Your billing history will appear here once you have invoices."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {billingInfo.invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded">
                          {invoice.status === "paid" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {invoice.status === "pending" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                          {invoice.status === "failed" && <AlertCircle className="h-4 w-4 text-red-500" />}
                        </div>
                        <div>
                          <div className="font-medium">Invoice #{invoice.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {invoice.date.toLocaleDateString()} • ${invoice.amount}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            invoice.status === "paid"
                              ? "default"
                              : invoice.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {invoice.status}
                        </Badge>
                        {invoice.downloadUrl && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  )
}
