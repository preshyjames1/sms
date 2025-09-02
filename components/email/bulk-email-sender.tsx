"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/context"
import { sendBulkNotification, type BulkEmailRecipient } from "@/lib/email/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Mail, Send, Users, Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface BulkEmailSenderProps {
  availableRecipients: BulkEmailRecipient[]
  onClose?: () => void
}

export function BulkEmailSender({ availableRecipients, onClose }: BulkEmailSenderProps) {
  const { user } = useAuth()
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ totalSent: number; successful: number; failed: number } | null>(null)
  const [error, setError] = useState("")

  const handleRecipientToggle = (email: string) => {
    setSelectedRecipients((prev) => (prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]))
  }

  const handleSelectAll = () => {
    if (selectedRecipients.length === availableRecipients.length) {
      setSelectedRecipients([])
    } else {
      setSelectedRecipients(availableRecipients.map((r) => r.email))
    }
  }

  const handleSend = async () => {
    if (!user?.schoolId || selectedRecipients.length === 0 || !subject.trim() || !content.trim()) {
      setError("Please fill in all fields and select at least one recipient")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const recipients = availableRecipients.filter((r) => selectedRecipients.includes(r.email))

      const result = await sendBulkNotification({
        recipients,
        subject: subject.trim(),
        content: content.trim(),
        schoolId: user.schoolId,
      })

      setResult(result)

      // Clear form on success
      if (result.successful > 0) {
        setSelectedRecipients([])
        setSubject("")
        setContent("")
      }
    } catch (error: any) {
      setError(error.message || "Failed to send emails")
    } finally {
      setLoading(false)
    }
  }

  const groupedRecipients = availableRecipients.reduce(
    (acc, recipient) => {
      const role = recipient.userId ? "users" : "external"
      if (!acc[role]) acc[role] = []
      acc[role].push(recipient)
      return acc
    },
    {} as Record<string, BulkEmailRecipient[]>,
  )

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Send Bulk Email
        </CardTitle>
        <CardDescription>Send emails to multiple recipients at once</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Results */}
        {result && (
          <Alert className={result.failed === 0 ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center gap-4">
                <span>
                  <strong>Sent:</strong> {result.successful}/{result.totalSent} emails
                </span>
                {result.failed > 0 && (
                  <span className="text-yellow-700">
                    <strong>Failed:</strong> {result.failed}
                  </span>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Email Form */}
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Message *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your message content..."
              rows={6}
              disabled={loading}
            />
          </div>
        </div>

        <Separator />

        {/* Recipients Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recipients ({selectedRecipients.length} selected)
            </h3>
            <Button variant="outline" size="sm" onClick={handleSelectAll} disabled={loading}>
              {selectedRecipients.length === availableRecipients.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="max-h-64 overflow-y-auto border rounded-lg p-4 space-y-4">
            {Object.entries(groupedRecipients).map(([role, recipients]) => (
              <div key={role} className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  {role === "users" ? "School Users" : "External Recipients"} ({recipients.length})
                </h4>
                <div className="grid gap-2">
                  {recipients.map((recipient) => (
                    <div key={recipient.email} className="flex items-center space-x-3">
                      <Checkbox
                        id={recipient.email}
                        checked={selectedRecipients.includes(recipient.email)}
                        onCheckedChange={() => handleRecipientToggle(recipient.email)}
                        disabled={loading}
                      />
                      <Label htmlFor={recipient.email} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">{recipient.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">{recipient.email}</span>
                          </div>
                          {recipient.userId && <Badge variant="secondary">User</Badge>}
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          {onClose && (
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSend}
            disabled={loading || selectedRecipients.length === 0 || !subject.trim() || !content.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send to {selectedRecipients.length} Recipients
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
