import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import contactRoutes from './src/routes/contactRoutes.js';
import errorHandler from './src/middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ debug: false });

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://bjadhs.github.io';

const corsOptions = {
  origin: NODE_ENV === 'production' ? FRONTEND_URL : true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/contact', contactRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

if (NODE_ENV === 'development') {
  const frontendPath = path.join(__dirname, '..', 'bjadhs_portfolio');
  app.use(express.static(frontendPath));
  app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${NODE_ENV})`);
  console.log(`API: http://localhost:${PORT}/api/contact`);
  if (NODE_ENV === 'development') {
    console.log(`Website: http://localhost:${PORT}`);
  }
});
