export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: PlanFeature[]
  limits: PlanLimits
  popular?: boolean
  color: string
  icon: string
}

export interface PlanFeature {
  name: string
  included: boolean
  description?: string
}

export interface PlanLimits {
  students: number | "unlimited"
  teachers: number | "unlimited"
  storage: number | "unlimited" // in GB
  classes: number | "unlimited"
  subjects: number | "unlimited"
  apiCalls: number | "unlimited" // per month
  emailNotifications: number | "unlimited" // per month
  customRoles: number | "unlimited"
  bulkImports: number | "unlimited" // per month
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: "free",
    name: "Free Plan",
    description: "Perfect for small schools getting started",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      { name: "Student Management", included: true },
      { name: "Teacher Management", included: true },
      { name: "Basic Attendance", included: true },
      { name: "Basic Reports", included: true },
      { name: "Email Support", included: true },
      { name: "Advanced Analytics", included: false },
      { name: "Custom Branding", included: false },
      { name: "API Access", included: false },
      { name: "Priority Support", included: false },
      { name: "Bulk Import/Export", included: false },
    ],
    limits: {
      students: 50,
      teachers: 10,
      storage: 1,
      classes: 5,
      subjects: 10,
      apiCalls: 0,
      emailNotifications: 100,
      customRoles: 0,
      bulkImports: 0,
    },
    color: "bg-gray-500",
    icon: "CheckCircle",
  },
  basic: {
    id: "basic",
    name: "Basic Plan",
    description: "Great for growing schools with more needs",
    price: {
      monthly: 29,
      yearly: 290,
    },
    features: [
      { name: "Student Management", included: true },
      { name: "Teacher Management", included: true },
      { name: "Advanced Attendance", included: true },
      { name: "Advanced Reports", included: true },
      { name: "Priority Support", included: true },
      { name: "Custom Branding", included: true },
      { name: "Bulk Import/Export", included: true },
      { name: "Advanced Analytics", included: false },
      { name: "API Access", included: false },
      { name: "White Label", included: false },
    ],
    limits: {
      students: 200,
      teachers: 50,
      storage: 10,
      classes: 20,
      subjects: 50,
      apiCalls: 1000,
      emailNotifications: 1000,
      customRoles: 5,
      bulkImports: 10,
    },
    color: "bg-blue-500",
    icon: "Zap",
  },
  premium: {
    id: "premium",
    name: "Premium Plan",
    description: "Perfect for established schools with advanced needs",
    price: {
      monthly: 79,
      yearly: 790,
    },
    popular: true,
    features: [
      { name: "Everything in Basic", included: true },
      { name: "Advanced Analytics", included: true },
      { name: "API Access", included: true },
      { name: "Custom Integrations", included: true },
      { name: "24/7 Support", included: true },
      { name: "Advanced Permissions", included: true },
      { name: "Mobile App Access", included: true },
      { name: "White Label", included: false },
      { name: "Dedicated Support", included: false },
    ],
    limits: {
      students: 1000,
      teachers: 200,
      storage: 100,
      classes: 100,
      subjects: 200,
      apiCalls: 10000,
      emailNotifications: 10000,
      customRoles: 20,
      bulkImports: 50,
    },
    color: "bg-purple-500",
    icon: "Crown",
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise Plan",
    description: "For large institutions with unlimited requirements",
    price: {
      monthly: 199,
      yearly: 1990,
    },
    features: [
      { name: "Everything in Premium", included: true },
      { name: "White Label Solution", included: true },
      { name: "Dedicated Support Manager", included: true },
      { name: "Custom Development", included: true },
      { name: "On-premise Deployment", included: true },
      { name: "Advanced Security", included: true },
      { name: "SLA Guarantee", included: true },
      { name: "Training & Onboarding", included: true },
    ],
    limits: {
      students: "unlimited",
      teachers: "unlimited",
      storage: "unlimited",
      classes: "unlimited",
      subjects: "unlimited",
      apiCalls: "unlimited",
      emailNotifications: "unlimited",
      customRoles: "unlimited",
      bulkImports: "unlimited",
    },
    color: "bg-gradient-to-r from-yellow-400 to-orange-500",
    icon: "Crown",
  },
}

export function getPlanLimits(planId: string): PlanLimits {
  return SUBSCRIPTION_PLANS[planId]?.limits || SUBSCRIPTION_PLANS.free.limits
}

export function checkFeatureAccess(planId: string, featureName: string): boolean {
  const plan = SUBSCRIPTION_PLANS[planId]
  if (!plan) return false

  const feature = plan.features.find((f) => f.name === featureName)
  return feature?.included || false
}

export function checkLimitUsage(
  planId: string,
  limitType: keyof PlanLimits,
  currentUsage: number,
): {
  allowed: boolean
  limit: number | "unlimited"
  percentage: number
} {
  const limits = getPlanLimits(planId)
  const limit = limits[limitType]

  if (limit === "unlimited") {
    return { allowed: true, limit, percentage: 0 }
  }

  const numericLimit = limit as number
  const percentage = (currentUsage / numericLimit) * 100

  return {
    allowed: currentUsage < numericLimit,
    limit: numericLimit,
    percentage: Math.min(percentage, 100),
  }
}
