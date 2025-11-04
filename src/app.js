import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { protect } from './middleware/authMiddleware.js';
import { isAdmin, isFarmer } from './middleware/roleMiddleware.js';
import { initDB } from './config/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Initialize DB (non-blocking)
initDB();

// Routes
app.use('/api/auth', authRoutes);

// Test endpoints for middleware
app.get('/api/test/protected', protect, (req, res) => {
	res.json({ success: true, user: req.user });
});

app.get('/api/test/admin-only', protect, isAdmin, (req, res) => {
	res.json({ success: true, message: 'admin access granted' });
});

app.get('/api/test/farmer-or-admin', protect, isFarmer, (req, res) => {
	res.json({ success: true, message: 'farmer access granted' });
});

export default app;
