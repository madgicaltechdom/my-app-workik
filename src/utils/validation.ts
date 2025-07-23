import { ValidationResult } from '../types';

// Email validation with comprehensive regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Password validation regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

// Phone number validation (international format)
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

// URL validation
const URL_REGEX = /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/;

/**
 * Sanitizes input by trimming whitespace and removing potentially harmful characters
 */
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic XSS characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Validates email address format
 */
function validateEmail(email: string): ValidationResult {
  const sanitizedEmail = sanitizeInput(email);
  
  if (!sanitizedEmail) {
    return {
      isValid: false,
      errorMessage: 'Email is required',
    };
  }
  
  if (sanitizedEmail.length > 254) {
    return {
      isValid: false,
      errorMessage: 'Email is too long',
    };
  }
  
  const isValid = EMAIL_REGEX.test(sanitizedEmail);
  
  return {
    isValid,
    errorMessage: isValid ? undefined : 'Please enter a valid email address',
  };
}

/**
 * Validates password strength
 */
function validatePassword(password: string): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      errorMessage: 'Password is required',
    };
  }
  
  if (password.length < 6) {
    return {
      isValid: false,
      errorMessage: 'Password must be at least 8 characters long',
    };
  }
  
  if (password.length > 128) {
    return {
      isValid: false,
      errorMessage: 'Password is too long',
    };
  }
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasUppercase) {
    return {
      isValid: false,
      errorMessage: 'Password must contain at least one uppercase letter',
    };
  }
  
  if (!hasLowercase) {
    return {
      isValid: false,
      errorMessage: 'Password must contain at least one lowercase letter',
    };
  }
  
  if (!hasNumber) {
    return {
      isValid: false,
      errorMessage: 'Password must contain at least one number',
    };
  }
  
  return {
    isValid: true,
  };
}

/**
 * Validates phone number format
 */
function validatePhoneNumber(phone: string): ValidationResult {
  const sanitizedPhone = sanitizeInput(phone).replace(/[\s\-\(\)]/g, '');
  
  if (!sanitizedPhone) {
    return {
      isValid: false,
      errorMessage: 'Phone number is required',
    };
  }
  
  const isValid = PHONE_REGEX.test(sanitizedPhone);
  
  return {
    isValid,
    errorMessage: isValid ? undefined : 'Please enter a valid phone number',
  };
}

/**
 * Validates URL format
 */
function validateUrl(url: string): ValidationResult {
  const sanitizedUrl = sanitizeInput(url);
  
  if (!sanitizedUrl) {
    return {
      isValid: false,
      errorMessage: 'URL is required',
    };
  }
  
  const isValid = URL_REGEX.test(sanitizedUrl);
  
  return {
    isValid,
    errorMessage: isValid ? undefined : 'Please enter a valid URL',
  };
}

/**
 * Validates required field
 */
function validateRequired(value: string, fieldName: string = 'Field'): ValidationResult {
  const sanitizedValue = sanitizeInput(value);
  const isValid = Boolean(sanitizedValue);
  
  return {
    isValid,
    errorMessage: isValid ? undefined : `${fieldName} is required`,
  };
}

/**
 * Validates minimum length
 */
function validateMinLength(value: string, minLength: number, fieldName: string = 'Field'): ValidationResult {
  const sanitizedValue = sanitizeInput(value);
  const isValid = sanitizedValue.length >= minLength;
  
  return {
    isValid,
    errorMessage: isValid ? undefined : `${fieldName} must be at least ${minLength} characters long`,
  };
}

/**
 * Validates maximum length
 */
function validateMaxLength(value: string, maxLength: number, fieldName: string = 'Field'): ValidationResult {
  const sanitizedValue = sanitizeInput(value);
  const isValid = sanitizedValue.length <= maxLength;
  
  return {
    isValid,
    errorMessage: isValid ? undefined : `${fieldName} must be no more than ${maxLength} characters long`,
  };
}

/**
 * Validates name format (letters, spaces, hyphens, apostrophes only)
 */
function validateName(name: string): ValidationResult {
  const sanitizedName = sanitizeInput(name);
  
  if (!sanitizedName) {
    return {
      isValid: false,
      errorMessage: 'Name is required',
    };
  }
  
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  const isValid = nameRegex.test(sanitizedName) && sanitizedName.length >= 2 && sanitizedName.length <= 50;
  
  return {
    isValid,
    errorMessage: isValid ? undefined : 'Please enter a valid name (2-50 characters, letters only)',
  };
}

/**
 * Validates date format (YYYY-MM-DD)
 */
function validateDate(date: string): ValidationResult {
  const sanitizedDate = sanitizeInput(date);
  
  if (!sanitizedDate) {
    return {
      isValid: false,
      errorMessage: 'Date is required',
    };
  }
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(sanitizedDate)) {
    return {
      isValid: false,
      errorMessage: 'Please enter date in YYYY-MM-DD format',
    };
  }
  
  const parsedDate = new Date(sanitizedDate);
  const isValidDate = parsedDate instanceof Date && !isNaN(parsedDate.getTime());
  
  if (!isValidDate) {
    return {
      isValid: false,
      errorMessage: 'Please enter a valid date',
    };
  }
  
  // Check if date is not in the future (for birth dates)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (parsedDate > today) {
    return {
      isValid: false,
      errorMessage: 'Date cannot be in the future',
    };
  }
  
  return {
    isValid: true,
  };
}

/**
 * Validates age based on date of birth
 */
function validateAge(dateOfBirth: string, minAge: number = 13): ValidationResult {
  const dateValidation = validateDate(dateOfBirth);
  if (!dateValidation.isValid) {
    return dateValidation;
  }
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
    ? age - 1 
    : age;
  
  const isValid = actualAge >= minAge;
  
  return {
    isValid,
    errorMessage: isValid ? undefined : `You must be at least ${minAge} years old`,
  };
}

/**
 * Validates multiple fields and returns combined result
 */
function validateFields(validations: ValidationResult[]): ValidationResult {
  const failedValidation = validations.find(validation => !validation.isValid);
  
  return {
    isValid: !failedValidation,
    errorMessage: failedValidation?.errorMessage,
  };
}

export {
  sanitizeInput,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateUrl,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateName,
  validateDate,
  validateAge,
  validateFields,
};

// Legacy exports for backward compatibility
export { validateEmail as isValidEmail };
export { sanitizeInput as sanitizeUserInput };