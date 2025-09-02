import Papa from "papaparse"

export interface ImportResult<T> {
  success: boolean
  data: T[]
  errors: ImportError[]
  totalRows: number
  validRows: number
}

export interface ImportError {
  row: number
  field: string
  message: string
  value?: any
}

export interface ImportTemplate {
  name: string
  description: string
  requiredFields: string[]
  optionalFields: string[]
  sampleData: Record<string, any>[]
  validationRules: ValidationRule[]
}

export interface ValidationRule {
  field: string
  type: "required" | "email" | "phone" | "date" | "number" | "enum"
  options?: string[]
  message?: string
}

export class CSVImporter {
  static parseCSV<T>(file: File): Promise<Papa.ParseResult<T>> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, "_"),
        complete: resolve,
        error: reject,
      })
    })
  }

  static validateData<T>(data: any[], template: ImportTemplate): ImportResult<T> {
    const errors: ImportError[] = []
    const validData: T[] = []

    data.forEach((row, index) => {
      const rowErrors: ImportError[] = []

      // Check required fields
      template.requiredFields.forEach((field) => {
        if (!row[field] || row[field].toString().trim() === "") {
          rowErrors.push({
            row: index + 1,
            field,
            message: `${field} is required`,
            value: row[field],
          })
        }
      })

      // Validate field types
      template.validationRules.forEach((rule) => {
        const value = row[rule.field]
        if (value && value.toString().trim() !== "") {
          const validationError = this.validateField(value, rule, index + 1)
          if (validationError) {
            rowErrors.push(validationError)
          }
        }
      })

      if (rowErrors.length === 0) {
        validData.push(row as T)
      } else {
        errors.push(...rowErrors)
      }
    })

    return {
      success: errors.length === 0,
      data: validData,
      errors,
      totalRows: data.length,
      validRows: validData.length,
    }
  }

  private static validateField(value: any, rule: ValidationRule, row: number): ImportError | null {
    const stringValue = value.toString().trim()

    switch (rule.type) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(stringValue)) {
          return {
            row,
            field: rule.field,
            message: rule.message || `Invalid email format`,
            value,
          }
        }
        break

      case "phone":
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
        if (!phoneRegex.test(stringValue.replace(/[\s\-$$$$]/g, ""))) {
          return {
            row,
            field: rule.field,
            message: rule.message || `Invalid phone number format`,
            value,
          }
        }
        break

      case "date":
        const date = new Date(stringValue)
        if (isNaN(date.getTime())) {
          return {
            row,
            field: rule.field,
            message: rule.message || `Invalid date format`,
            value,
          }
        }
        break

      case "number":
        if (isNaN(Number(stringValue))) {
          return {
            row,
            field: rule.field,
            message: rule.message || `Must be a valid number`,
            value,
          }
        }
        break

      case "enum":
        if (rule.options && !rule.options.includes(stringValue.toLowerCase())) {
          return {
            row,
            field: rule.field,
            message: rule.message || `Must be one of: ${rule.options.join(", ")}`,
            value,
          }
        }
        break
    }

    return null
  }

  static generateCSVTemplate(template: ImportTemplate): string {
    const headers = [...template.requiredFields, ...template.optionalFields]
    const sampleRows = template.sampleData.map((row) => headers.map((header) => row[header] || "").join(","))

    return [headers.join(","), ...sampleRows].join("\n")
  }
}

// Import templates for different data types
export const IMPORT_TEMPLATES: Record<string, ImportTemplate> = {
  students: {
    name: "Students Import",
    description: "Import student data with personal and academic information",
    requiredFields: ["first_name", "last_name", "email", "class_name", "admission_number"],
    optionalFields: ["phone", "date_of_birth", "gender", "address", "parent_email", "parent_phone"],
    sampleData: [
      {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@student.school.com",
        class_name: "Grade 10A",
        admission_number: "STU001",
        phone: "+1234567890",
        date_of_birth: "2008-05-15",
        gender: "male",
        address: "123 Main St, City, State",
        parent_email: "parent@email.com",
        parent_phone: "+1234567891",
      },
    ],
    validationRules: [
      { field: "email", type: "email" },
      { field: "parent_email", type: "email" },
      { field: "phone", type: "phone" },
      { field: "parent_phone", type: "phone" },
      { field: "date_of_birth", type: "date" },
      { field: "gender", type: "enum", options: ["male", "female", "other"] },
    ],
  },
  teachers: {
    name: "Teachers Import",
    description: "Import teacher data with professional information",
    requiredFields: ["first_name", "last_name", "email", "employee_id", "subjects"],
    optionalFields: ["phone", "date_of_birth", "gender", "address", "qualifications", "join_date", "salary"],
    sampleData: [
      {
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@school.com",
        employee_id: "EMP001",
        subjects: "Mathematics, Physics",
        phone: "+1234567890",
        date_of_birth: "1985-03-20",
        gender: "female",
        address: "456 Oak Ave, City, State",
        qualifications: "M.Sc Mathematics, B.Ed",
        join_date: "2020-08-15",
        salary: "50000",
      },
    ],
    validationRules: [
      { field: "email", type: "email" },
      { field: "phone", type: "phone" },
      { field: "date_of_birth", type: "date" },
      { field: "join_date", type: "date" },
      { field: "salary", type: "number" },
      { field: "gender", type: "enum", options: ["male", "female", "other"] },
    ],
  },
  parents: {
    name: "Parents Import",
    description: "Import parent/guardian data",
    requiredFields: ["first_name", "last_name", "email", "student_admission_numbers"],
    optionalFields: ["phone", "address", "occupation", "relationship"],
    sampleData: [
      {
        first_name: "Robert",
        last_name: "Doe",
        email: "robert.doe@email.com",
        student_admission_numbers: "STU001, STU002",
        phone: "+1234567890",
        address: "123 Main St, City, State",
        occupation: "Engineer",
        relationship: "father",
      },
    ],
    validationRules: [
      { field: "email", type: "email" },
      { field: "phone", type: "phone" },
      { field: "relationship", type: "enum", options: ["father", "mother", "guardian", "other"] },
    ],
  },
}
