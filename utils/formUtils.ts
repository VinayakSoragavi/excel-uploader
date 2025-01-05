import { Dispatch, SetStateAction } from 'react'
import { EmployeeData } from '../types/employee'

export const handleInputChange = (
  header: string,
  value: string,
  setFormData: Dispatch<SetStateAction<EmployeeData>>,
  setErrors: Dispatch<SetStateAction<EmployeeData>>
) => {
  setFormData(prev => ({ ...prev, [header]: value }))
  setErrors(prev => {
    const newErrors = { ...prev }
    delete newErrors[header]
    return newErrors
  })
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
  headers.forEach(header => {
    if (isRequired(header) && !formData[header]) {
      newErrors[header] = 'This field is required'
    } else if (!isRequired(header) && !formData[header] && !skippedFields[header]) {
      newErrors[header] = 'Please fill this field or click the skip button'
    }
  })
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

