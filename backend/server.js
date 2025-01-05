import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json()); // Parse JSON requests

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 50000,
	standardHeaders: true,
	legacyHeaders: false,
});

app.use('/api/', apiLimiter);

console.log('PIANO_API_URL:', process.env.PIANO_API_URL || 'undefined');

app.use(
	// Debug log for PIANO_API_URL
	'/external-api',
	createProxyMiddleware({
		target: process.env.PIANO_API_URL || 'https://api.piano.io/api/v3',
		changeOrigin: true,
		pathRewrite: { '^/external-api': '' },
		logLevel: 'warn',
		onProxyReq: (proxyReq, req) => {
			// Forward headers and body for POST requests
			if (req.body) {
				const bodyData = new URLSearchParams(req.body).toString();
				proxyReq.setHeader('Content-Type', 'application/x-www-form-urlencoded');
				proxyReq.write(bodyData);
			}
			proxyReq.removeHeader('cookie');
		},
		onError: (err, req, res) => {
			console.error('Proxy error:', err.message);
			res.status(500).json({ error: 'Proxy server error' });
		},
	})
);

// Health check endpoint
app.get('/api/health', (req, res) => {
	res.json({
		status: 'healthy',
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	});
});

// Subscriptions endpoint
app.get('/api/subscriptions', async (req, res, next) => {
	try {
		const queryParams = new URLSearchParams({
			limit: 1000, // Example: fetch large batches
			offset: 0,
		});

		const apiResponse = await fetch(
			`${process.env.PIANO_API_URL}/subscriptions?${queryParams}`,
			{
				headers: { Authorization: `Bearer ${process.env.PIANO_API_TOKEN}` },
			}
		);

		if (!apiResponse.ok) {
			throw new Error(
				`External API request failed with status ${apiResponse.status}`
			);
		}

		const data = await apiResponse.json();
		res.json(data);
	} catch (error) {
		next(error);
	}
});

// Catch-all route
app.get('*', (req, res) => {
	res.status(404).send('Route not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode).json({
		error:
			process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message,
	});
});

// Start server
const PORT = process.env.BACKEND_PORT || 5555;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
