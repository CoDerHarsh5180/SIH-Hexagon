import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';
import { seedApprovalsCatalog } from './utils/seedApprovals.js';

const PORT = process.env.PORT || 5000;

// Initialize Database Connection & Seed Master Catalogs
connectDB().then(() => {
  seedApprovalsCatalog();
});

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log(`🚀 SARAL Backend Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth API Base URL: http://localhost:${PORT}/api/auth`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Server Error] Unhandled Rejection: ${err.message}`);
});

export default server;
