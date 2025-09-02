"use client"

import type React from "react"

import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function PasswordReset() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Please enter your email address")
      return
    }

    try {
      setLoading(true)
      setError("")

      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/auth/login`,
        handleCodeInApp: false,
      })

      setSuccess(true)
    } catch (error: any) {
      console.error("Password reset error:", error)

      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email address")
          break
        case "auth/invalid-email":
          setError("Please enter a valid email address")
          break
        case "auth/too-many-requests":
          setError("Too many requests. Please try again later")
          break
        default:
          setError("Failed to send reset email. Please try again")
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>We've sent a password reset link to {email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Click the link in your email to reset your password. The link will expire in 1 hour.
            </AlertDescription>
          </Alert>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">Didn't receive the email? Check your spam folder.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false)
                setEmail("")
              }}
            >
              Try Different Email
            </Button>
          </div>

          <div className="text-center">
            <Link href="/auth/login">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          <div className="text-center">
            <Link href="/auth/login">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
