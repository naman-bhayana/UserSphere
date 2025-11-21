export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateName = (name: string): boolean => {
  return name.trim().length > 0
}

export const validatePhone = (phone: string): boolean => {
  return /^\d+$/.test(phone.trim())
}

export const validateUser = (name: string, email: string, phone: string): boolean => {
  if (!validateName(name)) {
    alert('Name is required')
    return false
  }
  if (!validateEmail(email)) {
    alert('Please enter a valid email address')
    return false
  }
  if (!validatePhone(phone)) {
    alert('Phone must contain digits only')
    return false
  }
  return true
}

