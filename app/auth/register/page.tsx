"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth/context"
import { School, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    schoolName: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)
  const [success, setSuccess] = useState(false)

  const { signUp } = useAuth()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const validateStep1 = () => {
    return formData.firstName && formData.lastName && formData.email && formData.phone
  }

  const validateStep2 = () => {
    return (
      formData.schoolName &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      formData.password.length >= 6
    )
  }

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
      setError("")
    } else if (step === 1) {
      setError("Please fill in all required fields")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep2()) {
      setError("Please check all fields and ensure passwords match")
      return
    }

    setLoading(true)
    setError("")

    try {
      await signUp(formData.email, formData.password, {
        role: "school_admin",
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        },
        schoolId: "", // Will be set to user ID in the signUp function
        schoolName: formData.schoolName, // Added school name to signup data
      })

      setSuccess(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <School className="h-8 w-8" />
              <span className="font-bold text-xl">SchoolManagementSystem.com</span>
            </Link>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-600">Account Created Successfully!</CardTitle>
              <CardDescription className="text-base">
                Welcome to SchoolManagementSystem.com! Your school account has been created and is ready to use.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-sm">Account Details:</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Name:</strong> {formData.firstName} {formData.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong> {formData.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>School:</strong> {formData.schoolName}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-sm">What's Next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Check your email for a welcome message</li>
                  <li>• Sign in to access your dashboard</li>
                  <li>• Start adding students, teachers, and staff</li>
                  <li>• Explore all the features available</li>
                </ul>
              </div>

              <Button onClick={() => router.push("/auth/login")} className="w-full">
                Continue to Sign In
              </Button>
            </CardContent>
          </Card>

          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              <CheckCircle className="mr-1 h-3 w-3" />
              14-day free trial started • No credit card required
            </Badge>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <School className="h-8 w-8" />
            <span className="font-bold text-xl">SchoolManagementSystem.com</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create Your School Account</h1>
          <p className="text-muted-foreground">Start managing your school with our comprehensive platform</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {step > 1 ? <CheckCircle className="h-4 w-4" /> : "1"}
            </div>
            <span className="ml-2 text-xs sm:text-sm text-muted-foreground hidden sm:inline">Personal Info</span>
            <span className="ml-2 text-xs text-muted-foreground sm:hidden">Info</span>
          </div>
          <div className={`w-6 sm:w-8 h-0.5 ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <span className="ml-2 text-xs sm:text-sm text-muted-foreground hidden sm:inline">School Setup</span>
            <span className="ml-2 text-xs text-muted-foreground sm:hidden">Setup</span>
          </div>
        </div>

        {/* Registration Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">{step === 1 ? "Personal Information" : "School Setup"}</CardTitle>
            <CardDescription>
              {step === 1
                ? "Tell us about yourself as the school administrator"
                : "Set up your school account and security"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={
                step === 1
                  ? (e) => {
                      e.preventDefault()
                      handleNextStep()
                    }
                  : handleSubmit
              }
              className="space-y-4"
            >
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {step === 1 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="admin@yourschool.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={!validateStep1()}>
                    Continue to School Setup
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name *</Label>
                    <Input
                      id="schoolName"
                      name="schoolName"
                      placeholder="Greenwood Academy"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <Alert variant="destructive">
                      <AlertDescription>Passwords do not match</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="w-full sm:w-1/2">
                      Back
                    </Button>
                    <Button type="submit" className="w-full sm:w-1/2" disabled={loading || !validateStep2()}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Features Badge */}
        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            <CheckCircle className="mr-1 h-3 w-3" />
            14-day free trial • No credit card required
          </Badge>
        </div>
      </div>
    </div>
  )
}
