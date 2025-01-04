import express from 'express';
import cors from 'cors'; // Import CORS middleware
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Import fetch for Node.js

dotenv.config(); // Load environment variables

const app = express();

// Step 1: Use CORS middleware to allow cross-origin requests from React frontend
app.use(cors());

// Step 2: Add logging to track the requests being proxied to the external API
app.use('/external-api', (req, res, next) => {
	console.log('Proxying request to:', process.env.PIANO_API_URL + req.url); // Log the request URL
	next(); // Pass to the next middleware (the proxy)
});

// Step 3: Set up proxy to forward requests to the external API
app.use(
	'/external-api',
	createProxyMiddleware({
		target: process.env.PIANO_API_URL, 
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

// Step 4.5: Filtering data
app.get('/api/subscriptions', async (req, res) => {
	const statusMapping = {
		Active: 'active',
		Cancelled: 'cancelled',
		Completed: 'completed',
		Expired: 'expired',
		'Payment Failed': 'payment_failed',
		Upgraded: 'upgraded',
		'Wont Renew': 'wont_renew',
	};

	const { page = 1, rowsPerPage = 10, filters } = req.query;

	try {
		// Parse and map filters
		const parsedFilters = filters ? JSON.parse(filters) : {};
		const statuses = parsedFilters.statuses || [];
		const mappedStatuses = statuses
			.map((status) => statusMapping[status])
			.filter(Boolean);

		// Construct query parameters for the external API
		const queryParams = new URLSearchParams({
			limit: rowsPerPage,
			offset: (page - 1) * rowsPerPage,
			...(mappedStatuses.length > 0 && { status: mappedStatuses.join(',') }),
		});
		console.log('Constructed external API query:', queryParams.toString());

		// Make the external API request
		const apiResponse = await fetch(
			`${process.env.PIANO_API_URL}/subscriptions?${queryParams}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.PIANO_API_TOKEN}`,
				},
			}
		);

		// Handle API errors
		if (!apiResponse.ok) {
			throw new Error(
				`External API request failed with status ${apiResponse.status}`
			);
		}

		const data = await apiResponse.json();
		res.json(data); // Return the response from the external API
	} catch (error) {
		console.error('Error in /api/subscriptions:', error);
		res.status(500).json({ error: 'Error fetching subscriptions' });
	}
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
