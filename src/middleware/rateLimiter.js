import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiter for contact form
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 contact submissions per hour
  message: {
    success: false,
    message: 'Too many contact attempts from this IP, please try again after an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests (only count failed attempts toward limit)
  skipSuccessfulRequests: false,
});

// Stricter limiter for production
export const strictContactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 contact submissions per hour in production
  message: {
    success: false,
    message: 'Too many messages sent from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
