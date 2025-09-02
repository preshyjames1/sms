"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Trash2 } from "lucide-react"
import { FileUpload } from "./file-upload"
import { StorageService, type UploadResult } from "@/lib/storage"

interface ProfilePictureUploadProps {
  currentImage?: string
  currentImagePath?: string
  onImageUpdate: (url: string, path: string) => void
  onError: (error: string) => void
  userName: string
  className?: string
}

export function ProfilePictureUpload({
  currentImage,
  currentImagePath,
  onImageUpdate,
  onError,
  userName,
  className = "",
}: ProfilePictureUploadProps) {
  const [showUpload, setShowUpload] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleUpload = (result: UploadResult) => {
    onImageUpdate(result.url, result.path)
    setShowUpload(false)
  }

  const handleDelete = async () => {
    if (!currentImagePath) return

    try {
      setDeleting(true)
      await StorageService.deleteFile(currentImagePath)
      onImageUpdate("", "")
    } catch (error) {
      onError("Failed to delete image")
    } finally {
      setDeleting(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (showUpload) {
    return (
      <div className={className}>
        <FileUpload
          onUpload={handleUpload}
          onError={onError}
          path="profile-pictures"
          allowedTypes={["image/jpeg", "image/png", "image/webp"]}
          maxSize={2 * 1024 * 1024} // 2MB
          accept="image/*"
        />
        <Button variant="outline" onClick={() => setShowUpload(false)} className="mt-4 w-full">
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentImage || "/placeholder.svg"} alt={userName} />
              <AvatarFallback className="text-lg">{getInitials(userName)}</AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="secondary"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              onClick={() => setShowUpload(true)}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center">
            <p className="font-medium">{userName}</p>
            <p className="text-sm text-gray-600">Profile Picture</p>
          </div>

          {currentImage && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {deleting ? "Deleting..." : "Remove"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
