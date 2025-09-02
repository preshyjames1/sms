"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/context"
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserTable } from "@/components/users/user-table"
import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/types"

export default function ParentsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [parents, setParents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchParents = async () => {
      if (!user?.schoolId) return

      try {
        const parentsQuery = query(
          collection(db, "users"),
          where("schoolId", "==", user.schoolId),
          where("role", "==", "parent"),
          where("isActive", "==", true),
        )

        const parentsSnapshot = await getDocs(parentsQuery)
        const parentsData = parentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as User[]

        setParents(parentsData)
      } catch (error) {
        console.error("Error fetching parents:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchParents()
  }, [user?.schoolId])

  const handleView = (parent: User) => {
    router.push(`/dashboard/parents/${parent.id}`)
  }

  const handleEdit = (parent: User) => {
    router.push(`/dashboard/parents/${parent.id}/edit`)
  }

  const handleDelete = async (parent: User) => {
    if (confirm(`Are you sure you want to delete ${parent.profile.firstName} ${parent.profile.lastName}?`)) {
      try {
        await updateDoc(doc(db, "users", parent.id), {
          isActive: false,
          updatedAt: new Date(),
        })

        // Remove from local state
        setParents((prev) => prev.filter((p) => p.id !== parent.id))
      } catch (error) {
        console.error("Error deleting parent:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Parents" }]} />
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading parents...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Parents" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parents</h1>
          <p className="text-muted-foreground">Manage parent accounts and guardians</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/import">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Bulk Import
            </Button>
          </Link>
          <Link href="/dashboard/parents/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Parent
            </Button>
          </Link>
        </div>
      </div>

      <UserTable users={parents} userType="parents" onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}
