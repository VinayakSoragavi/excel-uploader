import { Dispatch, SetStateAction } from 'react'
import { EmployeeData } from '../types/employee'

export const handleInputChange = (
  header: string,
  value: string,
  setFormData: Dispatch<SetStateAction<EmployeeData>>,
  setErrors: Dispatch<SetStateAction<EmployeeData>>
) => {
  setFormData(prev => ({ ...prev, [header]: value }))
}

export const isRequired = (header: string): boolean => {
  const lowerHeader = header.toLowerCase()
  return lowerHeader.includes('name') || lowerHeader.includes('id')
}

export const validateForm = (
  headers: string[],
  formData: EmployeeData,
  skippedFields: { [key: string]: boolean },
  setErrors: Dispatch<SetStateAction<EmployeeData>>
): boolean => {
  const newErrors: EmployeeData = {}
  let hasErrors = false

  headers.forEach(header => {
    const value = formData[header]?.trim() || ''
    const isSkipped = skippedFields[header]

    if (isRequired(header) && !value) {
      newErrors[header] = 'Please fill out this field.'
      hasErrors = true
    } else if (!isRequired(header) && !value && !isSkipped) {
      newErrors[header] = 'Please fill this field or click the skip button'
      hasErrors = true
    }
  })

  setErrors(newErrors)
  return !hasErrors
}

export const toggleSkip = (
  header: string,
  setSkippedFields: Dispatch<SetStateAction<{ [key: string]: boolean }>>,
  setFormData: Dispatch<SetStateAction<EmployeeData>>,
  setErrors: Dispatch<SetStateAction<EmployeeData>>
) => {
  setSkippedFields(prev => ({
    ...prev,
    [header]: !prev[header]
  }))
  
  setFormData(prev => {
    const newData = { ...prev }
    delete newData[header]
    return newData
  })
  
  setErrors(prev => {
    const newErrors = { ...prev }
    delete newErrors[header]
    return newErrors
  })
}