"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, File, ImageIcon, FileText } from "lucide-react"
import { StorageService, type UploadResult } from "@/lib/storage"
import { useAuth } from "@/lib/auth/context"

interface FileUploadProps {
  onUpload: (result: UploadResult) => void
  onError: (error: string) => void
  path: string
  allowedTypes?: string[]
  maxSize?: number
  multiple?: boolean
  accept?: string
  className?: string
}

export function FileUpload({
  onUpload,
  onError,
  path,
  allowedTypes = ["image/*", "application/pdf", "text/*"],
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false,
  accept = "image/*,.pdf,.doc,.docx,.txt",
  className = "",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const handleFiles = async (files: FileList) => {
    if (!user?.schoolId) {
      onError("School ID not found")
      return
    }

    const fileArray = Array.from(files)

    for (const file of fileArray) {
      const validation = StorageService.validateFile(file, allowedTypes, maxSize)
      if (validation) {
        onError(validation)
        continue
      }

      try {
        setUploading(true)
        setProgress(0)

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90))
        }, 200)

        const result = await StorageService.uploadFile(file, path, user.schoolId)

        clearInterval(progressInterval)
        setProgress(100)

        onUpload(result)

        setTimeout(() => {
          setProgress(0)
          setUploading(false)
        }, 1000)
      } catch (error) {
        setUploading(false)
        setProgress(0)
        onError(error instanceof Error ? error.message : "Upload failed")
      }
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-8 w-8" />
    if (type.includes("pdf")) return <FileText className="h-8 w-8" />
    return <File className="h-8 w-8" />
  }

  return (
    <Card className={`${className} ${dragActive ? "border-primary" : ""}`}>
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />

          {uploading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Upload className="h-12 w-12 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Uploading...</p>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-gray-500">{progress}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">Drop files here or click to upload</p>
                <p className="text-sm text-gray-600">
                  Supports: {allowedTypes.join(", ")} (Max: {maxSize / (1024 * 1024)}MB)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                Choose Files
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
