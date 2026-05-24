const express = require('express');
const cors = require('cors');
const path = require('path');
const dns = require('dns');

// Enforce global IPv4 resolution preference in Node
if (dns && dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

// Env variables loaded correctly
require("dotenv").config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const UserModel = require('./models/userModel');

// Core Express Setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const apiPrefix = process.env.API_PREFIX || '/api/v1';

// Health check and root
app.get('/', (req, res) => {
  res.json({
    message: 'Event Management API',
    status: 'Running',
    try: `${apiPrefix}/health`,
  });
});

app.get(`${apiPrefix}/health`, (req, res) => {
  const actualDbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disc+++++onnected';
  
  res.json({ 
    status: 'ok', 
    message: 'Event Management Backend is running',
    apiPrefix,
    database: actualDbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get(`${apiPrefix}/health/test-email`, async (req, res) => {
  const emailService = require('./services/emailService');
  const to = (req.query.to || process.env.TEST_EMAIL || process.env.SMTP_USER || '').trim();

  if (!to) {
    return res.status(400).json({
      status: 'error',
      message: 'Pass ?to=your@email.com or set TEST_EMAIL on the server',
    });
  }

  try {
    const result = await emailService.sendBookingConfirmation(
      to,
      'Test User',
      'Email Health Check',
      1,
      'test-booking-id'
    );

    if (result.success) {
      const payload = {
        status: 'success',
        message: `Test email sent to ${to}`,
        provider: result.provider,
        messageId: result.messageId,
      };
      if (result.failures?.length) {
        payload.warnings = result.failures;
        payload.hint =
          result.provider !== 'brevo-smtp' && result.provider !== 'brevo-api'
            ? 'Primary Brevo failed; email sent via fallback. Fix Brevo for customer booking emails.'
            : undefined;
      }
      return res.json(payload);
    }

    return res.status(500).json({
      status: 'error',
      message: result.error || 'Email send failed',
      brevoHttpKeyPresent: !!emailService.getBrevoHttpKey(),
      brevoHttpKeyError: emailService.getBrevoHttpKeySetupError?.() || undefined,
      brevoSmtpKeyPresent: !!(process.env.BREVO_SMTP_KEY || process.env.BREVO_API_KEY),
      cloudHost: emailService.isCloudHost(),
      smtpConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
      resendKeyPresent: !!process.env.RESEND_API_KEY,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Email test failed',
      error: err.message,
    });
  }
});


app.get(`${apiPrefix}/status`, (req, res) => {
  res.json({
    message: 'Event Management API Overview',
    prefix: apiPrefix,
    endpoints: {
      auth: { path: `${apiPrefix}/auth`, status: 'Public', description: 'Registration and Login' },
      users: { path: `${apiPrefix}/users`, status: 'JWT Secured', description: 'User profile and management' },
      events: { path: `${apiPrefix}/events`, status: 'JWT Secured', description: 'Event discovery and creation' },
      bookings: { path: `${apiPrefix}/bookings`, status: 'JWT Secured', description: 'Ticket purchases and history' },
    }
  });
});

// Mount API routes
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/events`, eventRoutes);
app.use(`${apiPrefix}/bookings`, bookingRoutes);

// Initial seed
async function seedAdminFromEnv() {
  const email = (process.env.TEST_EMAIL || 'meetjpatel2406@gmail.com').toLowerCase();
  const password = 'Meet@1234'; 
  try {
    const existing = await UserModel.findOne({ email });
    if (existing) return;
    
    await UserModel.create({
      email,
      password,
      name: 'Initial Admin',
      role: 'admin',
    });
    console.log(`Created initial admin user: ${email}`);
  } catch (error) {
    console.warn('Seed error:', error.message);
  }
}

// Global Error Handler
app.use((err, _req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    message,
  });
});

// Start server
const startServer = async () => {
  try {
    // Start listening immediately so that health checks and hosting platforms wake up instantly
    const server = app.listen(PORT, () => {
      console.log(`Backend API listening on port ${PORT}`);
    });

    // Connect to Database and Seed in the background (non-blocking)
    connectDB()
      .then(async () => {
        await seedAdminFromEnv();
      })
      .catch((err) => {
        console.error('Database connection / seeding failed:', err.message);
      });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
        process.exit(1);
      }
      throw err;
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
