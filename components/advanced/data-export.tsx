"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Download, FileSpreadsheet, FileText, Database } from "lucide-react"
import type { DateRange } from "react-day-picker"

interface DataExportProps {
  onExport: (config: ExportConfig) => Promise<void>
  availableFields: ExportField[]
  dataType: string
  className?: string
}

interface ExportConfig {
  format: "csv" | "excel" | "pdf"
  fields: string[]
  dateRange?: DateRange
  filters?: Record<string, any>
}

interface ExportField {
  key: string
  label: string
  required?: boolean
}

export function DataExport({ onExport, availableFields, dataType, className = "" }: DataExportProps) {
  const [format, setFormat] = useState<"csv" | "excel" | "pdf">("csv")
  const [selectedFields, setSelectedFields] = useState<string[]>(
    availableFields.filter((f) => f.required).map((f) => f.key),
  )
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [exporting, setExporting] = useState(false)

  const handleFieldToggle = (fieldKey: string, checked: boolean) => {
    if (checked) {
      setSelectedFields([...selectedFields, fieldKey])
    } else {
      const field = availableFields.find((f) => f.key === fieldKey)
      if (!field?.required) {
        setSelectedFields(selectedFields.filter((key) => key !== fieldKey))
      }
    }
  }

  const handleExport = async () => {
    try {
      setExporting(true)
      await onExport({
        format,
        fields: selectedFields,
        dateRange,
      })
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setExporting(false)
    }
  }

  const getFormatIcon = (fmt: string) => {
    switch (fmt) {
      case "csv":
        return <FileSpreadsheet className="h-4 w-4" />
      case "excel":
        return <FileSpreadsheet className="h-4 w-4" />
      case "pdf":
        return <FileText className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export {dataType}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Export Format</Label>
          <Select value={format} onValueChange={(value: any) => setFormat(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV File
                </div>
              </SelectItem>
              <SelectItem value="excel">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel File
                </div>
              </SelectItem>
              <SelectItem value="pdf">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF Report
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date Range (Optional)</Label>
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
        </div>

        <div className="space-y-2">
          <Label>Fields to Export</Label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {availableFields.map((field) => (
              <div key={field.key} className="flex items-center space-x-2">
                <Checkbox
                  id={field.key}
                  checked={selectedFields.includes(field.key)}
                  onCheckedChange={(checked) => handleFieldToggle(field.key, checked as boolean)}
                  disabled={field.required}
                />
                <Label htmlFor={field.key} className={`text-sm ${field.required ? "font-medium" : ""}`}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">* Required fields cannot be deselected</p>
        </div>

        <Button onClick={handleExport} disabled={selectedFields.length === 0 || exporting} className="w-full">
          {exporting ? (
            "Exporting..."
          ) : (
            <div className="flex items-center gap-2">
              {getFormatIcon(format)}
              Export {selectedFields.length} Fields
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
