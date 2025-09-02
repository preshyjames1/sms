"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "./file-upload"
import { StorageService, type UploadResult } from "@/lib/storage"
import { Trash2, Download, FileText, ImageIcon, File } from "lucide-react"

interface DocumentUploadProps {
  documents: UploadResult[]
  onDocumentsUpdate: (documents: UploadResult[]) => void
  onError: (error: string) => void
  title: string
  description?: string
  allowedTypes?: string[]
  maxFiles?: number
  className?: string
}

export function DocumentUpload({
  documents,
  onDocumentsUpdate,
  onError,
  title,
  description,
  allowedTypes = [
    "application/pdf",
    "image/*",
    "text/*",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  maxFiles = 10,
  className = "",
}: DocumentUploadProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleUpload = (result: UploadResult) => {
    if (documents.length >= maxFiles) {
      onError(`Maximum ${maxFiles} files allowed`)
      return
    }
    onDocumentsUpdate([...documents, result])
  }

  const handleDelete = async (document: UploadResult) => {
    try {
      setDeleting(document.path)
      await StorageService.deleteFile(document.path)
      onDocumentsUpdate(documents.filter((doc) => doc.path !== document.path))
    } catch (error) {
      onError("Failed to delete document")
    } finally {
      setDeleting(null)
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (type.includes("pdf")) return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="secondary">
            {documents.length}/{maxFiles}
          </Badge>
        </CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.length < maxFiles && (
          <FileUpload
            onUpload={handleUpload}
            onError={onError}
            path="documents"
            allowedTypes={allowedTypes}
            maxSize={10 * 1024 * 1024} // 10MB
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
          />
        )}

        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Uploaded Documents</h4>
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.type)}
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(doc.url, "_blank")}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(doc)}
                      disabled={deleting === doc.path}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
