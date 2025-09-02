import { ref, uploadBytes, getDownloadURL, deleteObject, listAll, getMetadata } from "firebase/storage"
import { storage } from "../firebase"

export interface UploadResult {
  url: string
  path: string
  name: string
  size: number
  type: string
}

export class StorageService {
  // Upload file to Firebase Storage
  static async uploadFile(file: File, path: string, schoolId: string): Promise<UploadResult> {
    try {
      const fileName = `${Date.now()}_${file.name}`
      const fullPath = `schools/${schoolId}/${path}/${fileName}`
      const storageRef = ref(storage, fullPath)

      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      return {
        url: downloadURL,
        path: fullPath,
        name: fileName,
        size: file.size,
        type: file.type,
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      throw new Error("Failed to upload file")
    }
  }

  // Delete file from Firebase Storage
  static async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path)
      await deleteObject(storageRef)
    } catch (error) {
      console.error("Error deleting file:", error)
      throw new Error("Failed to delete file")
    }
  }

  // Get all files in a directory
  static async listFiles(path: string, schoolId: string) {
    try {
      const fullPath = `schools/${schoolId}/${path}`
      const storageRef = ref(storage, fullPath)
      const result = await listAll(storageRef)

      const files = await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item)
          const metadata = await getMetadata(item)
          return {
            name: item.name,
            url,
            path: item.fullPath,
            size: metadata.size,
            type: metadata.contentType,
            created: metadata.timeCreated,
          }
        }),
      )

      return files
    } catch (error) {
      console.error("Error listing files:", error)
      throw new Error("Failed to list files")
    }
  }

  // Validate file type and size
  static validateFile(file: File, allowedTypes: string[], maxSize: number): string | null {
    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not allowed`
    }

    if (file.size > maxSize) {
      return `File size exceeds ${maxSize / (1024 * 1024)}MB limit`
    }

    return null
  }
}
