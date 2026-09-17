import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import approvalsRoutes from './routes/approvalsRoutes.js';
import applicationsRoutes from './routes/applicationsRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import vaultRoutes from './routes/vaultRoutes.js';
import grievancesRoutes from './routes/grievancesRoutes.js';
import benefitsRoutes from './routes/benefitsRoutes.js';
import notificationsRoutes from './routes/notificationsRoutes.js';
import localAuthRoutes from './routes/localAuthRoutes.js';
import mainAuthRoutes from './routes/mainAuthRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

// Middlewares
app.use(
  cors({
    origin: true, // Allow frontend dev server on any port (localhost:5173, etc.)
    credentials: true,
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'SARAL Backend Server is active and operational.',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes for All 10 Services
app.use('/api/auth', authRoutes);
app.use('/api/approvals', approvalsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/grievances', grievancesRoutes);
app.use('/api/benefits', benefitsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/local-auth', localAuthRoutes);
app.use('/api/main-auth', mainAuthRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 Catch-All Route
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API route not found - ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]', err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export default app;
