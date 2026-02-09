import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import contactRoutes from './src/routes/contactRoutes.js';
import errorHandler from './src/middleware/errorHandler.js';
import { apiLimiter, contactLimiter } from './src/middleware/rateLimiter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ debug: false });

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security: Helmet middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS - must be before all routes
const allowedOrigins = [
  'https://bjadhs.github.io',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || NODE_ENV === 'development') {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// Rate limiting - apply to all API requests
app.use('/api/', apiLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Contact routes with stricter rate limiting
app.use('/api/contact', contactLimiter, contactRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend in development
if (NODE_ENV === 'development') {
  const frontendPath = path.join(__dirname, '..', 'bjadhs_portfolio');
  app.use(express.static(frontendPath));
  app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${NODE_ENV})`);
  console.log(`Security: Helmet enabled, Rate limiting enabled`);
});
