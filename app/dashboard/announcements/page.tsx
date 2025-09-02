"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Megaphone, Plus, Search, Calendar, Users } from "lucide-react"
import type { Announcement } from "@/lib/types/communication"

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Parent-Teacher Conference",
    content:
      "Annual parent-teacher conferences will be held from March 15-17. Please schedule your appointments through the parent portal.",
    authorId: "admin1",
    authorName: "John Admin",
    targetAudience: ["parents", "teachers"],
    priority: "high",
    publishDate: new Date("2024-01-10"),
    expiryDate: new Date("2024-03-20"),
    status: "published",
  },
  {
    id: "2",
    title: "Science Fair Registration",
    content:
      "Registration for the annual science fair is now open. Students can submit their project proposals until February 28th.",
    authorId: "admin1",
    authorName: "John Admin",
    targetAudience: ["students", "parents"],
    priority: "medium",
    publishDate: new Date("2024-01-08"),
    expiryDate: new Date("2024-03-01"),
    status: "published",
  },
]

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements)
  const [showCreate, setShowCreate] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Manage school-wide announcements and notifications</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Create Announcement Form */}
      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Announcement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Enter announcement title" />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea placeholder="Enter announcement content" rows={4} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label className="text-sm font-medium">Target Audience</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="teachers">Teachers</SelectItem>
                    <SelectItem value="parents">Parents</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Expiry Date</label>
                <Input type="date" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button>Publish Announcement</Button>
              <Button variant="outline">Save as Draft</Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <Card key={announcement.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Megaphone className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>By {announcement.authorName}</span>
                      <span>•</span>
                      <Calendar className="h-3 w-3" />
                      <span>{announcement.publishDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      announcement.priority === "high"
                        ? "destructive"
                        : announcement.priority === "medium"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {announcement.priority}
                  </Badge>
                  <Badge variant="outline">{announcement.status}</Badge>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{announcement.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Target: {announcement.targetAudience.join(", ")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Archive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
