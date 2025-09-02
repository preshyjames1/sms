import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth/context"
import "./globals.css"

export const metadata: Metadata = {
  title: "SchoolManagementSystem.com - Complete School Management Solution",
  description:
    "Comprehensive multi-tenant school management system for administrators, teachers, students, and parents. Manage academics, attendance, communication, and more.",
  generator: "SchoolManagementSystem.com",
  keywords: "school management, education software, student information system, academic management, multi-tenant",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
