import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from 'lucide-react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { handleInputChange, toggleSkip, isRequired, validateForm } from '../../utils/formUtils'
import {  EmployeeData } from '../../types/employee'
import { Row } from '@/types/excel-table'

interface EditEmployeeFormProps {
  employee: Row
  headers: string[]
  onEditEmployee: (updatedEmployee: Row) => void
  onOpenChange: (open: boolean) => void
}

export function EditEmployeeForm({ employee, headers, onEditEmployee, onOpenChange }: EditEmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeData>(
    headers.reduce((acc, header, index) => {
      acc[header] = employee[index]?.toString() || ''
      return acc
    }, {} as EmployeeData)
  )
  
  const [skippedFields, setSkippedFields] = useState<{ [key: string]: boolean }>(
    headers.reduce((acc, header, index) => {
      acc[header] = employee[index] === ''
      return acc
    }, {} as { [key: string]: boolean })
  )
  
  const [errors, setErrors] = useState<EmployeeData>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched on submit
    const allTouched = headers.reduce((acc, header) => {
      acc[header] = true
      return acc
    }, {} as { [key: string]: boolean })
    setTouched(allTouched)

    if (validateForm(headers, formData, skippedFields, setErrors)) {
      const updatedEmployee: Row = headers.map(header => {
        if (skippedFields[header]) return ''
        return formData[header] || ''
      })
      
      onEditEmployee(updatedEmployee)
      toast.success('Updated successfully!')
      onOpenChange(false)
    } else {
      toast.error('Please fix the errors before submitting.')
    }
  }

  const handleBlur = (header: string) => {
    setTouched(prev => ({ ...prev, [header]: true }))
    validateField(header)
  }

  const validateField = (header: string) => {
    const value = formData[header] || ''
    const newErrors = { ...errors }

    if (isRequired(header) && !value.trim()) {
      newErrors[header] = 'Please fill out this field.'
    } else if (!isRequired(header) && !value.trim() && !skippedFields[header]) {
      newErrors[header] = 'Please fill this field or click the skip button'
    } else {
      delete newErrors[header]
    }

    setErrors(newErrors)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-[400px] overflow-y-auto p-4">
      {headers.map((header, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center space-x-1">
            <Label htmlFor={header} className="text-sm font-medium">
              {header}
            </Label>
            {isRequired(header) && (
              <span className="text-red-500">*</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id={header}
              name={header}
              value={formData[header] || ''}
              onChange={(e) => {
                handleInputChange(header, e.target.value, setFormData, setErrors)
                if (touched[header]) {
                  validateField(header)
                }
              }}
              onBlur={() => handleBlur(header)}
              required={isRequired(header)}
              disabled={skippedFields[header]}
              className={`flex-grow ${touched[header] && errors[header] ? 'border-red-500 focus:ring-red-500' : ''}`}
              aria-invalid={touched[header] && errors[header] ? 'true' : 'false'}
            />
            {!isRequired(header) && (
              <Button
                type="button"
                variant={skippedFields[header] ? "secondary" : "outline"}
                size="icon"
                onClick={() => {
                  toggleSkip(header, setSkippedFields, setFormData, setErrors)
                  setTouched(prev => ({ ...prev, [header]: true }))
                }}
              >
                <X className={`h-4 w-4 ${skippedFields[header] ? 'text-gray-400' : ''}`} />
              </Button>
            )}
          </div>
          {touched[header] && errors[header] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[header]}
            </p>
          )}
        </div>
      ))}
      <div className="pt-4">
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </div>
    </form>
  )
}

