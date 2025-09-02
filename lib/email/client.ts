"use client"

import { httpsCallable } from "firebase/functions"
import { functions } from "@/lib/firebase"

// Client-side email functions
export const emailFunctions = {
  sendPasswordResetEmail: httpsCallable(functions, "sendPasswordResetEmail"),
  sendBulkNotificationEmail: httpsCallable(functions, "sendBulkNotificationEmail"),
}

export interface BulkEmailRecipient {
  userId?: string
  email: string
  name: string
}

export interface BulkEmailData {
  recipients: BulkEmailRecipient[]
  subject: string
  content: string
  schoolId: string
}

export async function sendPasswordReset(email: string, resetLink: string) {
  try {
    const result = await emailFunctions.sendPasswordResetEmail({
      email,
      resetLink,
    })
    return result.data
  } catch (error) {
    console.error("Error sending password reset email:", error)
    throw error
  }
}

export async function sendBulkNotification(data: BulkEmailData) {
  try {
    const result = await emailFunctions.sendBulkNotificationEmail(data)
    return result.data
  } catch (error) {
    console.error("Error sending bulk notification:", error)
    throw error
  }
}
