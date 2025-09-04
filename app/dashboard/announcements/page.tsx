"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/context"
import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Megaphone, Plus, Search, Calendar, Users, Loader2 } from "lucide-react"
import type { Announcement } from "@/lib/types/communication"

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    targetAudience: [] as string[],
    expiryDate: "",
  })

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!user?.schoolId) return

      try {
        const announcementsQuery = query(
          collection(db, "announcements"),
          where("schoolId", "==", user.schoolId),
          orderBy("publishDate", "desc"),
        )
        const announcementsSnapshot = await getDocs(announcementsQuery)
        const announcementsData = announcementsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Announcement[]
        setAnnouncements(announcementsData)
      } catch (error) {
        console.error("Error fetching announcements:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [user?.schoolId])

  const handlePublishAnnouncement = async () => {
    if (!user?.schoolId || !formData.title || !formData.content) return

    setPublishing(true)
    try {
      const announcementData = {
        title: formData.title,
        content: formData.content,
        authorId: user.uid,
        authorName: `${user.profile?.firstName} ${user.profile?.lastName}`,
        targetAudience: formData.targetAudience.length > 0 ? formData.targetAudience : ["all"],
        priority: formData.priority,
        publishDate: new Date(),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        status: "published",
        schoolId: user.schoolId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const docRef = await addDoc(collection(db, "announcements"), announcementData)

      // Add to local state
      setAnnouncements((prev) => [{ id: docRef.id, ...announcementData }, ...prev])

      // Reset form
      setFormData({
        title: "",
        content: "",
        priority: "medium",
        targetAudience: [],
        expiryDate: "",
      })
      setShowCreate(false)

      alert("Announcement published successfully!")
    } catch (error) {
      console.error("Error publishing announcement:", error)
      alert("Failed to publish announcement")
    } finally {
      setPublishing(false)
    }
  }

  const handleArchiveAnnouncement = async (announcementId: string) => {
    try {
      await updateDoc(doc(db, "announcements", announcementId), {
        status: "archived",
        updatedAt: new Date(),
      })

      setAnnouncements((prev) => prev.map((ann) => (ann.id === announcementId ? { ...ann, status: "archived" } : ann)))
    } catch (error) {
      console.error("Error archiving announcement:", error)
    }
  }

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Announcements" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading announcements...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Announcements" }]} />

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
                <Input
                  placeholder="Enter announcement title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Enter announcement content"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
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
                  <Select
                    value={formData.targetAudience[0] || "all"}
                    onValueChange={(value) =>
                      setFormData({ ...formData, targetAudience: value === "all" ? [] : [value] })
                    }
                  >
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
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePublishAnnouncement} disabled={publishing}>
                  {publishing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Announcement"
                  )}
                </Button>
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
          {filteredAnnouncements.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground">
                  {searchTerm
                    ? "No announcements found matching your search."
                    : "No announcements yet. Create your first announcement to get started."}
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredAnnouncements.map((announcement) => (
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
                          <span>{new Date(announcement.publishDate).toLocaleDateString()}</span>
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
                        Target:{" "}
                        {announcement.targetAudience.length === 0
                          ? "All Users"
                          : announcement.targetAudience.join(", ")}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleArchiveAnnouncement(announcement.id)}>
                        Archive
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
