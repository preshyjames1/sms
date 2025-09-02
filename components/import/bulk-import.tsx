"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  GraduationCap,
  UserCheck,
} from "lucide-react"
import { CSVImporter, type ImportResult, IMPORT_TEMPLATES } from "@/lib/import/csv-parser"

interface BulkImportProps {
  onImport: (data: any[], type: string) => Promise<void>
  onError: (error: string) => void
  className?: string
}

export function BulkImport({ onImport, onError, className = "" }: BulkImportProps) {
  const [selectedType, setSelectedType] = useState<string>("students")
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult<any> | null>(null)
  const [progress, setProgress] = useState(0)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        onError("Please select a CSV file")
        return
      }
      setFile(selectedFile)
      setImportResult(null)
    }
  }

  const handleImport = async () => {
    if (!file) {
      onError("Please select a file to import")
      return
    }

    try {
      setImporting(true)
      setProgress(10)

      // Parse CSV
      const parseResult = await CSVImporter.parseCSV(file)
      setProgress(30)

      if (parseResult.errors.length > 0) {
        onError("Error parsing CSV file")
        return
      }

      // Validate data
      const template = IMPORT_TEMPLATES[selectedType]
      const validationResult = CSVImporter.validateData(parseResult.data, template)
      setProgress(60)

      setImportResult(validationResult)

      if (validationResult.success && validationResult.data.length > 0) {
        // Import valid data
        await onImport(validationResult.data, selectedType)
        setProgress(100)
      }
    } catch (error) {
      console.error("Import error:", error)
      onError("Failed to import data")
    } finally {
      setImporting(false)
      setTimeout(() => setProgress(0), 2000)
    }
  }

  const downloadTemplate = (type: string) => {
    const template = IMPORT_TEMPLATES[type]
    const csvContent = CSVImporter.generateCSVTemplate(template)
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${type}_import_template.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "students":
        return <GraduationCap className="h-4 w-4" />
      case "teachers":
        return <Users className="h-4 w-4" />
      case "parents":
        return <UserCheck className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Bulk Import
        </CardTitle>
        <CardDescription>Import multiple users at once using CSV files</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={selectedType} onValueChange={setSelectedType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teachers
            </TabsTrigger>
            <TabsTrigger value="parents" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Parents
            </TabsTrigger>
          </TabsList>

          {Object.entries(IMPORT_TEMPLATES).map(([type, template]) => (
            <TabsContent key={type} value={type} className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadTemplate(type)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Required Fields</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.requiredFields.map((field) => (
                        <Badge key={field} variant="destructive" className="text-xs">
                          {field.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Optional Fields</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.optionalFields.map((field) => (
                        <Badge key={field} variant="secondary" className="text-xs">
                          {field.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" id="csv-upload" />
              <label
                htmlFor="csv-upload"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium">{file ? file.name : "Click to select CSV file"}</p>
                  <p className="text-xs text-muted-foreground">CSV files only, max 10MB</p>
                </div>
              </label>
            </div>
          </div>

          {importing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Importing data...</span>
                <span className="text-sm">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <Button onClick={handleImport} disabled={!file || importing} className="w-full">
            {importing ? "Importing..." : "Import Data"}
          </Button>
        </div>

        {importResult && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {importResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <h3 className="font-medium">Import Results</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{importResult.totalRows}</div>
                <div className="text-sm text-muted-foreground">Total Rows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{importResult.validRows}</div>
                <div className="text-sm text-muted-foreground">Valid Rows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{importResult.errors.length}</div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Import Errors:</p>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {importResult.errors.slice(0, 10).map((error, index) => (
                        <div key={index} className="text-xs">
                          Row {error.row}: {error.message} ({error.field})
                        </div>
                      ))}
                      {importResult.errors.length > 10 && (
                        <div className="text-xs">... and {importResult.errors.length - 10} more errors</div>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {importResult.success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Successfully imported {importResult.validRows} {selectedType}!
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
