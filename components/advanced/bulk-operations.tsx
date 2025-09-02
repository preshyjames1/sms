"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Trash2, Download, Mail, UserCheck, UserX } from "lucide-react"

interface BulkOperationsProps {
  selectedItems: string[]
  onSelectAll: (selected: boolean) => void
  onBulkDelete: (ids: string[]) => Promise<void>
  onBulkUpdate: (ids: string[], updates: any) => Promise<void>
  onBulkExport: (ids: string[]) => void
  onBulkEmail: (ids: string[]) => void
  totalItems: number
  itemType: string
  className?: string
}

export function BulkOperations({
  selectedItems,
  onSelectAll,
  onBulkDelete,
  onBulkUpdate,
  onBulkExport,
  onBulkEmail,
  totalItems,
  itemType,
  className = "",
}: BulkOperationsProps) {
  const [operation, setOperation] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleBulkOperation = async () => {
    if (selectedItems.length === 0) {
      setError("Please select items to perform bulk operation")
      return
    }

    try {
      setLoading(true)
      setError("")

      switch (operation) {
        case "delete":
          await onBulkDelete(selectedItems)
          break
        case "activate":
          await onBulkUpdate(selectedItems, { isActive: true })
          break
        case "deactivate":
          await onBulkUpdate(selectedItems, { isActive: false })
          break
        case "export":
          onBulkExport(selectedItems)
          break
        case "email":
          onBulkEmail(selectedItems)
          break
        default:
          setError("Please select an operation")
          return
      }

      setOperation("")
    } catch (error) {
      setError("Failed to perform bulk operation")
    } finally {
      setLoading(false)
    }
  }

  const isAllSelected = selectedItems.length === totalItems && totalItems > 0
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < totalItems

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Bulk Operations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={isAllSelected}
              ref={(el) => {
                if (el) el.indeterminate = isPartiallySelected
              }}
              onCheckedChange={onSelectAll}
            />
            <span className="text-sm">
              Select All ({totalItems} {itemType})
            </span>
          </div>
          <Badge variant="secondary">{selectedItems.length} selected</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Select value={operation} onValueChange={setOperation}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose operation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activate">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Activate Selected
                </div>
              </SelectItem>
              <SelectItem value="deactivate">
                <div className="flex items-center gap-2">
                  <UserX className="h-4 w-4" />
                  Deactivate Selected
                </div>
              </SelectItem>
              <SelectItem value="export">
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Selected
                </div>
              </SelectItem>
              <SelectItem value="email">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send Email
                </div>
              </SelectItem>
              <SelectItem value="delete">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleBulkOperation}
            disabled={!operation || selectedItems.length === 0 || loading}
            variant={operation === "delete" ? "destructive" : "default"}
          >
            {loading ? "Processing..." : "Apply"}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          Select items from the table above and choose an operation to apply to all selected items at once.
        </div>
      </CardContent>
    </Card>
  )
}
