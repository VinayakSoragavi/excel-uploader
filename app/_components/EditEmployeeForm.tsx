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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm(headers, formData, skippedFields, setErrors)) {
      const updatedEmployee: Row = headers.map(header => {
        if (skippedFields[header]) return ''
        return formData[header] || ''
      })
      onEditEmployee(updatedEmployee)
      toast.success('Updated successfully!')
    } else {
      toast.error('Please fix the errors before submitting.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-[400px] overflow-y-auto">
      {headers.map((header, index) => (
        <div key={index} className="space-y-2">
          <Label htmlFor={header}>{header}</Label>
          <div className="flex items-center space-x-2">
            <Input
              id={header}
              value={formData[header] || ''}
              onChange={(e) => handleInputChange(header, e.target.value, setFormData, setErrors)}
              required={isRequired(header)}
              disabled={skippedFields[header]}
              className={`flex-grow ${errors[header] ? 'border-red-500' : ''}`}
            />
            {!isRequired(header) && (
              <Button
                type="button"
                variant={skippedFields[header] ? "secondary" : "outline"}
                size="icon"
                onClick={() => toggleSkip(header, setSkippedFields, setFormData, setErrors)}
              >
                <X className={`h-4 w-4 ${skippedFields[header] ? 'text-gray-400' : ''}`} />
              </Button>
            )}
          </div>
          {errors[header] && (
            <p className="text-red-500 text-sm mt-1">{errors[header]}</p>
          )}
        </div>
      ))}
      <Button onClick={() => onOpenChange(false)} type="submit">Save Changes</Button>
    </form>
  )
}

