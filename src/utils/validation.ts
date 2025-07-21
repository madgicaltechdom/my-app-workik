// Email validation: RFC 5322 Official Standard (simplified)
export function validateEmail(email: string): boolean {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email);
}

// Phone validation: allows +, spaces, dashes, parentheses, and must be 7-15 digits
export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/[^\d]/g, '');
  return cleaned.length >= 7 && cleaned.length <= 15;
}

// Date validation: checks for YYYY-MM-DD format and valid date
export function validateDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === date;
}

// Password validation: at least 6 characters, at least one letter and one number
export function validatePassword(password: string): boolean {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
}

// Sanitizes input by trimming whitespace
export function sanitizeInput(input: string): string {
  return input.trim();
} 