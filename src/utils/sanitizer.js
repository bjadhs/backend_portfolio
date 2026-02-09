// Sanitize HTML tags to prevent XSS attacks
export const sanitizeHtml = (value) => {
  if (typeof value !== 'string') return value;
  
  // Remove potentially dangerous HTML tags and attributes
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick, onerror, etc.
    .trim();
};

// Escape HTML entities to prevent XSS
export const escapeHtml = (value) => {
  if (typeof value !== 'string') return value;
  
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };
  
  return value.replace(/[&<>"']/g, (char) => htmlEntities[char]);
};

// Normalize email address
export const normalizeEmail = (email) => {
  if (typeof email !== 'string') return email;
  
  return email
    .toLowerCase()
    .trim();
};
