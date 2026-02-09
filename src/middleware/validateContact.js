import { z } from 'zod';
import { sanitizeHtml, escapeHtml, normalizeEmail } from '../utils/sanitizer.js';

const contactSchema = z.object({
  name: z
    .string()
    .transform(val => escapeHtml(sanitizeHtml(val.trim())))
    .pipe(z.string().min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes')),
  
  email: z
    .string()
    .transform(val => normalizeEmail(val))
    .pipe(z.string().email('Please enter a valid email address')
    .max(254, 'Email must not exceed 254 characters')),
  
  subject: z
    .string()
    .transform(val => escapeHtml(sanitizeHtml(val.trim())))
    .pipe(z.string().min(3, 'Subject must be at least 3 characters')
    .max(200, 'Subject must not exceed 200 characters')),
  
  message: z
    .string()
    .transform(val => escapeHtml(sanitizeHtml(val.trim())))
    .pipe(z.string().min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must not exceed 5000 characters')),
});

export const validateContact = (req, res, next) => {
  const result = contactSchema.safeParse(req.body);
  
  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      field: err.path[0],
      message: err.message,
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
  
  // Use the validated/sanitized data
  req.body = result.data;
  next();
};
