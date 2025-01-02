import express from 'express';
import cors from 'cors'; // Import CORS middleware
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();

// Step 1: Use CORS middleware to allow cross-origin requests from React frontend
app.use(cors()); // Allow all origins by default, can restrict later if needed

// Step 2: Add logging to track the requests being proxied to the external API
app.use('/external-api', (req, res, next) => {
	console.log('Proxying request to:', process.env.PIANO_API_URL + req.url); // Log the request URL
	next(); // Pass to the next middleware (the proxy)
});

// Step 3: Set up proxy to forward requests to the external API
app.use(
	'/external-api',
	createProxyMiddleware({
		target: process.env.PIANO_API_URL, // Ensure the target is correct
		changeOrigin: true, // Modify the origin header to match the target
		pathRewrite: { '^/external-api': '' }, // Remove '/external-api' from the forwarded requests
		onProxyReq: (proxyReq, req, res) => {
			// Log the full URL and query parameters being sent to the external API
			console.log(`Proxying to: ${process.env.PIANO_API_URL}${req.url}`);
		},
	})
);

// Step 4: Health check route for testing the server
app.get('/api/health', (req, res) => {
	res.send('Server is healthy');
});

// Step 5: Catch-all route for unmatched paths (React will handle static assets and frontend routes)
app.get('*', (req, res) => {
	res.status(404).send('Route not found');
});

// Step 6: Start the server
const PORT = process.env.BACKEND_PORT || 5555;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
