"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, Search, Filter, Plus } from "lucide-react"
import type { Message } from "@/lib/types/communication"

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "teacher1",
    senderName: "Sarah Johnson",
    senderRole: "teacher",
    recipientId: "admin1",
    recipientName: "John Admin",
    recipientRole: "admin",
    subject: "Student Progress Update",
    content: "I wanted to update you on the progress of students in my mathematics class...",
    timestamp: new Date("2024-01-15T10:30:00"),
    read: false,
    priority: "medium",
  },
  {
    id: "2",
    senderId: "parent1",
    senderName: "Michael Brown",
    senderRole: "parent",
    recipientId: "admin1",
    recipientName: "John Admin",
    recipientRole: "admin",
    subject: "Meeting Request",
    content: "I would like to schedule a meeting to discuss my child's academic performance...",
    timestamp: new Date("2024-01-14T14:20:00"),
    read: true,
    priority: "high",
  },
]

export function MessageCenter() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMessages = messages.filter(
    (message) =>
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.senderName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Message List */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Messages
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <Button size="sm" onClick={() => setShowCompose(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1 max-h-[500px] overflow-y-auto">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 cursor-pointer hover:bg-muted/50 border-b transition-colors ${
                  selectedMessage?.id === message.id ? "bg-muted" : ""
                } ${!message.read ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-sm">{message.senderName}</div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        message.priority === "high"
                          ? "destructive"
                          : message.priority === "medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {message.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{message.timestamp.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="font-medium text-sm mb-1">{message.subject}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">{message.content}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Message Content */}
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedMessage.subject}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>From: {selectedMessage.senderName}</span>
                    <span>•</span>
                    <span>{selectedMessage.timestamp.toLocaleString()}</span>
                  </div>
                </div>
                <Badge
                  variant={
                    selectedMessage.priority === "high"
                      ? "destructive"
                      : selectedMessage.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {selectedMessage.priority} priority
                </Badge>
              </div>
              <div className="prose max-w-none">
                <p>{selectedMessage.content}</p>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button>Reply</Button>
                <Button variant="outline">Forward</Button>
                <Button variant="outline">Mark as Unread</Button>
              </div>
            </div>
          ) : showCompose ? (
            <ComposeMessage onClose={() => setShowCompose(false)} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a message to read or compose a new one</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ComposeMessage({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Compose Message</h3>
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">To</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select recipient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="teacher1">Sarah Johnson (Teacher)</SelectItem>
              <SelectItem value="parent1">Michael Brown (Parent)</SelectItem>
              <SelectItem value="student1">Emma Wilson (Student)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Subject</label>
          <Input placeholder="Enter subject" />
        </div>
        <div>
          <label className="text-sm font-medium">Priority</label>
          <Select defaultValue="medium">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Message</label>
          <Textarea placeholder="Type your message here..." rows={6} />
        </div>
        <div className="flex gap-2">
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          <Button variant="outline">Save Draft</Button>
        </div>
      </div>
    </div>
  )
}
