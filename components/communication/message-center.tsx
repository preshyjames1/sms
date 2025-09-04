"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/context"
import { collection, query, where, getDocs, addDoc, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, Search, Filter, Plus } from "lucide-react"
import type { Message } from "@/lib/types/communication"

export function MessageCenter() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.schoolId) return

      try {
        // Fetch messages where user is recipient
        const messagesQuery = query(
          collection(db, "messages"),
          where("schoolId", "==", user.schoolId),
          where("recipientId", "==", user.uid),
          orderBy("timestamp", "desc"),
        )
        const messagesSnapshot = await getDocs(messagesQuery)
        const messagesData = messagesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[]
        setMessages(messagesData)

        // Fetch all users for compose functionality
        const usersQuery = query(
          collection(db, "users"),
          where("schoolId", "==", user.schoolId),
          where("isActive", "==", true),
        )
        const usersSnapshot = await getDocs(usersQuery)
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setUsers(usersData)
      } catch (error) {
        console.error("Error fetching messages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.schoolId, user?.uid])

  const filteredMessages = messages.filter(
    (message) =>
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.senderName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const unreadCount = messages.filter((m) => !m.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    )
  }

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
            {filteredMessages.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {searchTerm ? "No messages found matching your search." : "No messages yet."}
              </div>
            ) : (
              filteredMessages.map((message) => (
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
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="font-medium text-sm mb-1">{message.subject}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{message.content}</div>
                </div>
              ))
            )}
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
                    <span>{new Date(selectedMessage.timestamp).toLocaleString()}</span>
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
            <ComposeMessage users={users} onClose={() => setShowCompose(false)} />
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

function ComposeMessage({ users, onClose }: { users: any[]; onClose: () => void }) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    recipientId: "",
    subject: "",
    content: "",
    priority: "medium",
  })
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!user?.schoolId || !formData.recipientId || !formData.subject || !formData.content) return

    setSending(true)
    try {
      const recipient = users.find((u) => u.id === formData.recipientId)
      const messageData = {
        schoolId: user.schoolId,
        senderId: user.uid,
        senderName: `${user.profile?.firstName} ${user.profile?.lastName}`,
        senderRole: user.role,
        recipientId: formData.recipientId,
        recipientName: `${recipient?.profile?.firstName} ${recipient?.profile?.lastName}`,
        recipientRole: recipient?.role,
        subject: formData.subject,
        content: formData.content,
        priority: formData.priority,
        timestamp: new Date(),
        read: false,
      }

      await addDoc(collection(db, "messages"), messageData)
      onClose()
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

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
          <Select
            value={formData.recipientId}
            onValueChange={(value) => setFormData({ ...formData, recipientId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select recipient" />
            </SelectTrigger>
            <SelectContent>
              {users.map((userData) => (
                <SelectItem key={userData.id} value={userData.id}>
                  {userData.profile?.firstName} {userData.profile?.lastName} ({userData.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Subject</label>
          <Input
            placeholder="Enter subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Priority</label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
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
          <Textarea
            placeholder="Type your message here..."
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSend} disabled={sending}>
            <Send className="h-4 w-4 mr-2" />
            {sending ? "Sending..." : "Send Message"}
          </Button>
          <Button variant="outline">Save Draft</Button>
        </div>
      </div>
    </div>
  )
}
