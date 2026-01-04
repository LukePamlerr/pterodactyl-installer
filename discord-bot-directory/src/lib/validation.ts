export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export function validateBotSubmission(data: {
  applicationId: string
  name: string
  description: string
  tags: string[]
  website?: string
  support?: string
  github?: string
}): ValidationResult {
  const errors: ValidationError[] = []

  // Application ID validation
  if (!data.applicationId) {
    errors.push({ field: 'applicationId', message: 'Application ID is required' })
  } else if (!/^\d{17,19}$/.test(data.applicationId)) {
    errors.push({ field: 'applicationId', message: 'Invalid Discord Application ID format' })
  }

  // Name validation
  if (!data.name) {
    errors.push({ field: 'name', message: 'Bot name is required' })
  } else if (data.name.length < 2) {
    errors.push({ field: 'name', message: 'Bot name must be at least 2 characters long' })
  } else if (data.name.length > 100) {
    errors.push({ field: 'name', message: 'Bot name must be less than 100 characters' })
  }

  // Description validation
  if (!data.description) {
    errors.push({ field: 'description', message: 'Description is required' })
  } else if (data.description.length < 50) {
    errors.push({ field: 'description', message: 'Description must be at least 50 characters long' })
  } else if (data.description.length > 1000) {
    errors.push({ field: 'description', message: 'Description must be less than 1000 characters' })
  }

  // Tags validation
  if (!data.tags || data.tags.length === 0) {
    errors.push({ field: 'tags', message: 'At least one tag is required' })
  } else if (data.tags.length > 10) {
    errors.push({ field: 'tags', message: 'Maximum 10 tags allowed' })
  }

  // URL validation
  const urlRegex = /^https?:\/\/.+/
  
  if (data.website && !urlRegex.test(data.website)) {
    errors.push({ field: 'website', message: 'Website must be a valid URL' })
  }

  if (data.support && !urlRegex.test(data.support)) {
    errors.push({ field: 'support', message: 'Support server must be a valid URL' })
  }

  if (data.github && !urlRegex.test(data.github)) {
    errors.push({ field: 'github', message: 'GitHub repository must be a valid URL' })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateReview(data: {
  rating: number
  comment?: string
}): ValidationResult {
  const errors: ValidationError[] = []

  // Rating validation
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.push({ field: 'rating', message: 'Rating must be between 1 and 5' })
  }

  // Comment validation
  if (data.comment && data.comment.length > 1000) {
    errors.push({ field: 'comment', message: 'Comment must be less than 1000 characters' })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
}

export function validateDiscordApplicationId(applicationId: string): boolean {
  return /^\d{17,19}$/.test(applicationId)
}

export function validateDiscordUserId(userId: string): boolean {
  return /^\d{17,19}$/.test(userId)
}
